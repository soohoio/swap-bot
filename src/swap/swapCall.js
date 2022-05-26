const {caver, KLAYSWAP_ROUTER_ADDRESS, ZERO_ADDRESS, Tokens} = require("../swap.config")
const KlayswapABI = require("../abi/klayswap.abi.json")


/**
 * 
 * @param {string} eoa 
 * @param {string} amountIn 
 * @param {string} amountOutMin 
 * @param {string[]} path 
 * @param {Date} deadline 
 */
module.exports.swapCall = async function(
    eoa,
    amountIn,
    amountOutMin,
    path,
    deadline
){

    const routerContract = caver.contract.create(KlayswapABI.KlayswapRouter, KLAYSWAP_ROUTER_ADDRESS)
    const tokenAddressPath = path.map( p => Tokens[p].address)

    const deadlineTimestamp = Math.round(deadline.getTime() / 1000)

    if(tokenAddressPath[0] === ZERO_ADDRESS){
        const gas = await routerContract
            .methods
            .swapExactKlayForTokens(
                amountIn,
                amountOutMin,
                tokenAddressPath,
                eoa,
                deadlineTimestamp
            ).estimateGas({
                from: eoa,
                value: amountIn
            })
    
        console.log(gas)

    } else {
        const gas = await routerContract
            .methods
            .swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                tokenAddressPath,
                eoa,
                deadlineTimestamp
            ).estimateGas({
                from: eoa
            })
    
        console.log(gas)
    }
}