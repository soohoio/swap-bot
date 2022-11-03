const { caver, SOURCE_ADDRESS, DESTINATION_ADDRESS } = require('../swap.config')
const ERC20ABI = require("../abi/erc20.min.json")
const { messageBox } = require('../utils/messageBox')
const Big = require('big.js')

const KLEVA_ADDRESS = "0x5fFF3a6C16C2208103F318F4713D4D90601A7313"

module.exports.sendKleva = async function (){
    const KLEVA_CONTRACT = caver.contract.create(ERC20ABI, KLEVA_ADDRESS)
    const _amount = await KLEVA_CONTRACT.methods.balanceOf(SOURCE_ADDRESS).call()
    const amount = Big(_amount).toFixed()

    if(+amount > 0){
        const tx = await KLEVA_CONTRACT
            .methods.transfer(DESTINATION_ADDRESS, amount)
            .send({
                from: SOURCE_ADDRESS,
                gas: 80000
            })

        messageBox.add(`*[SWAP BOT]* ${
            Big(_amount).div(Big(1E18)).toFixed(4)
        } KLEVA가 ${DESTINATION_ADDRESS}으로 전송되었습니다.\n(tx: ${tx.transactionHash})`)
    }
}