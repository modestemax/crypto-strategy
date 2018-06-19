const debug = require('debug')('strategy');
const redisLib = require('redis');
const _ = require('lodash');
const Promise = require('bluebird');
const redisClient = redisLib.createClient();
const redis = Promise.promisifyAll(redisClient);
const redisPub = redisClient.duplicate();

const tvLoader = require('crypto-signal-finder/src/tv-loader');

module.exports = class Strategy {

    constructor({ name }) {
        Object.assign(this, { bid: null, name });
    }

    async check(signal) {
        if (await this.test(signal)) {
            debug(`${this.name} test OK`);
            const { exchange, symbolId, timeframe } = signal.candle;
            Object.assign(this, { symbolId, timeframe, exchange });
            this.notify();
        }
    }

    test(signal) {
    }

    notify() {
        const { name: strategy, bid, exchange, symbolId, timeframe } = this;
        if (bid) {
            redisPub.publish('crypto-bid', JSON.stringify({ strategy, bid, exchange, symbolId, timeframe }));
            debug(`start trade [strategy:${strategy}] on ${symbolId} at bid: ${bid}`)
        }
    }

    async getTicker({ exchange: exchangeId, symbolId }) {
        let tick = await  tvLoader({ filter: symbolId, exchangeId });
        return tick[symbolId]
    }

    async findSignal({ exchange, symbolId, timeframe, position }) {
        let key = await getKey({ exchange, symbolId, timeframe, position });
        if (key) {
            let signal = await redis.getAsync(key);
            return JSON.parse(signal);
        }
    }

    change({ open, close }) {
        return (close - open) / open * 100;
    }
};


const timeframesIntervals = {
    1: 60e3,
    5: 5 * 60e3,
    15: 15 * 60e3,
    60: 60 * 60e3,
    240: 240 * 60e3,
    [60 * 24]: 60 * 24 * 60e3,
};

async function getLastKey({ exchange, symbolId, timeframe, position = 0 }) {
    let key = await getKey.apply(null, arguments);
    if (key) {
        return key
    } else {
        return getLastKey({ exchange, symbolId, timeframe, position: position + 1 })
    }
}

async function getKey({ exchange, symbolId, timeframe, position = 0 }) {

    const time = new Date((Math.trunc((Date.now()) / timeframesIntervals[timeframe]) - position) * timeframesIntervals[timeframe])

    const timeKey = `${time.getDate()}/${time.getMonth() + 1}:${time.getHours()}h${time.getMinutes()}`;
    const key = `${exchange}:${symbolId}:${timeKey}:m${timeframe}`;

    if (await redis.existsAsync(key)) {
        return key
    }

}

