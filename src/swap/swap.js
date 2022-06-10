const { Tokens } = require('../swap.config')
const { searchPaths } = require('./searchPaths')
const { getLiquidityAndFee } = require('./getLiquidityAndFee')
const { calcPaths } = require('./calcPaths')
const Big = require('big.js')
const { swapCall } = require('./swapCall')


/**
 * 
 * @param {number} fromIndex 
 * @param {number} toIndex 
 * @param {Big} amount 
 * @param {string} source      출금 계좌 
 * @param {string} destination 송금 계좌 
 * 
 */
module.exports.swap = async function(fromIndex, toIndex, amount, source, destination){

    const paths = searchPaths(fromIndex, toIndex)
    if(paths.length === 0 || paths[0].length < 2){
        throw Error(`Path from ${Tokens[fromIndex].name} to ${Tokens[toIndex].name} not exists.`);
    }

    const {liquidities, fees} = await getLiquidityAndFee()

    const sortedPaths = calcPaths(amount, paths, liquidities, fees);
    const output = sortedPaths[0];
    const deadline = new Date();
    // 3분 뒤
    deadline.setMinutes(deadline.getMinutes()+3);

    const minOut = Big(output.amount).mul(1 - +process.env.SLIPPAGE).round().toString();

    console.log(`${amount.toString()} ${Tokens[fromIndex].name} will be swapped at least ${minOut.toString()} ${Tokens[toIndex].name}`)
    console.log("\x1b[36m",`Path: ${output.path.map(tId => Tokens[tId].name).join(' -> ')}`)

    await swapCall(
        source,
        destination,
        amount.toString(),
        minOut,
        output.path,
        deadline
    )
}