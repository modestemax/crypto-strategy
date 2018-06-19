const TestEma = require('./testEma01.strategy');
const EmaH1H4 = require('./emaH1H4.strategy');

module.exports = {
    testEma: new TestEma(),
    emaH1H4: new EmaH1H4()
};