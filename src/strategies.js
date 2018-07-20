const { strategies } = require('common/settings');

module.exports = strategies.reduce(strategies, (strategies, strat_name) => {
    return Object.assign(strategies, { [strat_name]: new (require(`./${strat_name}.strategy`))() })
}, {});