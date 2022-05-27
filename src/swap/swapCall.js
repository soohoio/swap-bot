const {caver, KLAYSWAP_ROUTER_ADDRESS, ZERO_ADDRESS, Tokens, EOA} = require("../swap.config")
const KlayswapABI = require("../abi/klayswap.abi.json")
const ERC20ABI = require("../abi/erc20.min.json")


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
    const routerContract = new caver.contract(KlayswapABI.KlayswapRouter, KLAYSWAP_ROUTER_ADDRESS)

    const tokenAddressPath = path.map( p => Tokens[p].address)
    const deadlineTimestamp = Math.round(deadline.getTime() / 1000)

    const params = [
        amountIn,
        amountOutMin,
        tokenAddressPath,
        eoa,
        deadlineTimestamp
    ]

    let methodName, value;

    if(tokenAddressPath[0] === ZERO_ADDRESS){
        methodName = 'swapExactKlayForTokens'
        value = amountIn
    } else {    // Token
        // approve first
        try {
            await caver.contract.create(ERC20ABI, tokenAddressPath[0])
                .methods
                .approve(KLAYSWAP_ROUTER_ADDRESS, amountIn)
                .send({
                    from: EOA,
                    gas: 500000,
                })
        } catch (error) {
            console.log(`Failed to approve: ${Tokens[path[0]].name}`)
            return;
        }

        methodName = 'swapExactTokensForTokens'
        value = 0;
    }

    try {
        const signedTx = await routerContract.send(
            {
                from: eoa,
                gas: 1000000,
                value
            },
            methodName,
            ...params
        )
        console.log(`Swap transaction succeed: (tx: ${signedTx.transactionHash})`)
    } catch (error) {

        console.log(`Failed to swap: ${Tokens[path[0]].name}. Slippage may have occurred due to price fluctuations.`)
        return;
    }


}