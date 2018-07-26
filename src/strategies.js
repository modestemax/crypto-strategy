const { strategies } = require('common/settings');
const _ = require('lodash');

module.exports = _.mapValue(strategies, (strategyOptions, strat_name) =>
    new (require(`./${strat_name}.strategy`))(strategyOptions)
);