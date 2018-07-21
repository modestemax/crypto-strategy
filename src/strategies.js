const { strategies } = require('common/settings');

module.exports = strategies.reduce((strategies, strat_name) =>
    Object.assign(strategies, { [strat_name]: new (require(`./${strat_name}.strategy`))() })
    , {});