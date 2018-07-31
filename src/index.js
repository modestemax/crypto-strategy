const debug = require('debug')('signals');
const redisLib = require('redis');
const _ = require('lodash');
const redisClient = redisLib.createClient();
const redisSub = redisClient.duplicate();
const strategy = require('./strategies');


redisSub.on('pmessage', async (pattern, channel, data) => {
    //debug(channel + ' received');
    if (/newData:.*/.test(channel)) {
        const signal = JSON.parse(data);

        strategy.testEma01.check(signal);
        strategy.emaH1H4.check(signal);
    }
});


redisSub.psubscribe('newData:*');