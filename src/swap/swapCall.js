const {caver, KLAYSWAP_ROUTER_ADDRESS, ZERO_ADDRESS, Tokens} = require("../swap.config")
const KlayswapABI = require("../abi/klayswap.abi.json")
const ERC20ABI = require("../abi/erc20.min.json")
const { messageBox } = require('../utils/messageBox')


/**
 * @param {string} from_account 
 * @param {string} to_account
 * @param {string} amountIn 
 * @param {string} amountOutMin 
 * @param {string[]} path 
 * @param {Date} deadline 
 */
module.exports.swapCall = async function(
    from_account,
    to_account,
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
        to_account,
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
                    from: from_account,
                    gas: 100000,
                })
        } catch (error) {
            console.log(`Failed to approve: ${Tokens[path[0]].name}`)
            return;
        }

        methodName = 'swapExactTokensForTokens'
        value = 0;
    }

    try {
        const tx = await routerContract.send(
            {
                from: from_account,
                gas: 1500000,
                value
            },
            methodName,
            ...params
        )

        console.log("\x1b[32m",`Swap transaction succeed: (tx: ${tx.transactionHash})\n`, '\x1b[0m')
        messageBox.add(`트랜잭션에 성공했습니다. (tx: ${tx.transactionHash})\n\n`)
    } catch (error) {
        console.log("\x1b[31m", `Failed to swap: ${Tokens[path[0]].name}. Slippage may have occurred due to price fluctuations.\n`, '\x1b[0m')
        messageBox.add(`트랜잭션에 실패했습니다. 가격 변동으로 인해 스왑이 진행되지 않았을 수 있습니다.\n\n`)
        return;
    }
}