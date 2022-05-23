const Big = require('big.js')

module.exports.calcPos = function(amount, aPool, bPool, fee){
    const num = bPool.mul(amount).mul(new Big(10000 - fee))
    const den = aPool.mul(new Big(10000)).add(
        amount.mul(new Big(10000 - fee))
    )

    return num.div(den)
}
