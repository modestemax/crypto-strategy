Template = require('./strategyTemplate');

module.exports = class extends Template {
    constructor(signalFinder) {
        super({ name: 'testEma', signalFinder })
    }

    test(signal) {
        if (signal.ema10Above20 && signal.plusDiAboveMinusDi && signal.adxAboveRef && signal.adxIsTrendingUp) {
            this.bid = 1;
            return true;
        }
    }
}


//     testStrategy01({ m1, m5, symbolId }) {
//
//
//         return m1.ema10Ema20CrossingDistance > 1 && m1.ema10Ema20Distance > .2 //&& m1.ema10IsTrendingUp && m1.ema20IsTrendingUp
//             && m1.macdAboveSignal
//             && m5.ema10Above20 && m5.macdAboveSignal
//             && m1.candle.rsi > 60
//             // && m1.rsiBelowHighRef
//             && (m1.rsiIsTrendingUp || m1.stochasticKIsTrendingUp)
//     },
//     testEma01({ symbolId, timeframe, signal, signalFinder }) {
// return new Template({})
//         return m1.ema10Ema20CrossingDistance > 1
//             && m1.ema10Ema20Distance > .1
//             && 1 <= m5.ema10Ema20CrossingDistance && m5.ema10Ema20CrossingDistance <= 2
//         // && m1.candle.rsi > 60
//         // // && m1.rsiBelowHighRef
//         // && (m1.rsiIsTrendingUp || m1.stochasticKIsTrendingUp)
//     },
//     testGainer({ m1, m5, symbolId }) {
//         console.log(` ${symbolId} m1.changes.last1mChange ${m1.changes.last1mChange }
//             `)
//         return m1.changes.last1mChange > 1
//     }
// }
//
