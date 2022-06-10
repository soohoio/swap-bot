const { caver, WKLAY_ADDRESS} = require("../swap.config")
const abi = require("../abi/wklay.abi.json")

/**
 * 
 * @notice account 계좌에 있는 모든 WKLAY를 KLAY로 withdraw합니다.
 * @param {string} account 
 */
module.exports.withdrawWKLAY = async (account) => {
    if(!WKLAY_ADDRESS)
        return;

    try {
        const wklayContract = new caver.contract(abi, WKLAY_ADDRESS)
        const balance = await wklayContract.methods.balanceOf(account).call()
        if(!+balance)
            return;

        const signedTx =await wklayContract
            .methods
            .withdraw(balance)
            .send({
                from: account,
                gas: 50000
            })
        
        console.log("\x1b[32m", `Withdraw ${balance} WKLAY succeed: (tx: ${signedTx.transactionHash})\n`, '\x1b[0m')
    } catch (error) {
        console.log("\x1b[31m", `Failed to withdraw WKLAY`, '\x1b[0m')
        console.log(error)   
    }
}