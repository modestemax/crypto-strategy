const debug = require('debug')('signals');
const redisLib = require('redis');
const _ = require('lodash');
const redisClient = redisLib.createClient();
const redisSub = redisClient.duplicate();
const strategy = require('./strategies');


redisSub.on('pmessage', async (pattern, channel, data) => {
    debug(channel + ' received');
    const signal = JSON.parse(data);

    strategy.testEma.check(signal);
    strategy.emaH1H4.check(signal);

});


redisSub.psubscribe('newData:*');