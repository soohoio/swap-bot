const { caver, Tokens, ZERO_ADDRESS, RESERVED_KLAY, SOURCE_ADDRESS, DESTINATION_ADDRESS } = require('../swap.config')
const Big = require('big.js')
const { envValidator } = require('../env-validators/env-validator')
const ERC20ABI = require("../abi/erc20.min.json")
const { swap } = require("./swap")
const { withdrawWKLAY } = require("./withdrawWKLAY")
const { messageBox } = require('../utils/messageBox')
const { sendKleva } = require('../send-kleva')


module.exports.batchSwap = async function(){

    const {fromIndexes, toIndex} = envValidator(
        Tokens,
        process.env.FROM_TOKENS,
        process.env.TO_TOKEN,
        process.env.SLIPPAGE,
        process.env.RESERVED_KLAY,
    )

    messageBox.add(`*[Swap Bot]* 스왑 봇이 실행되었습니다. \n`)

    await withdrawWKLAY(SOURCE_ADDRESS);

    // 1. 먼저 교환해야 할 토큰의 balance를 구하여 보낼 양(amount)을 계산한다.
    // amount가 0이면 교환하지 않음.
    // 교환 대상 토큰이 2개 이상이면 일단 SOURCE로 스왑한 후 DESTINATION으로 일괄 전송
    // 1개이면 바로 SOURCE -> DESTINATION으로 전송

    const sendAmounts = []
    // 먼저 balance를 취합한다.
    for await (const from of fromIndexes) {
        const {address, name} = Tokens[from]
        let balance, amount;
        
        if(address !== ZERO_ADDRESS){   // ERC20 TOKEN
            balance = await caver.contract.create(ERC20ABI, address).methods.balanceOf(SOURCE_ADDRESS).call()
            amount = Big(balance)
        } 
        else {                          // KLAY
            balance = await caver.klay.getBalance(SOURCE_ADDRESS)
            amount = Big(balance).sub( Big(RESERVED_KLAY).mul(1E18) )
            amount = amount.gt(Big(0)) ? amount : Big(0)
        }

        console.log(`Balance Of ${name} : ${balance}`)
        sendAmounts.push(amount)
    }
    console.log('\n-------------------------------\n')

    const toSendCount = sendAmounts.filter(amount => amount.toNumber() > 0).length
    
    // 스왑 결과 토큰의 스왑 전 balance
    const getToTokenBalance = async () => {
        if(toIndex === 0){
            return await caver.klay.getBalance(SOURCE_ADDRESS)
        } else {
            const TO_TOKEN_CONTRACT = caver.contract.create(ERC20ABI, Tokens[toIndex].address)
            return await TO_TOKEN_CONTRACT.methods.balanceOf(SOURCE_ADDRESS).call()
        }
    }


    if(!toSendCount){
        console.log("No tokens to swap.")
        return;
    }

    for (let i = 0; i < fromIndexes.length; i++) {
        const from = fromIndexes[i]
        const amount = sendAmounts[i];

        if(+amount <= 0)
            continue;

        if(toSendCount === 1){
            // 교환하는 토큰이 하나인 경우 바로 DESTINATION으로 보냄
            await swap(from, toIndex, amount, SOURCE_ADDRESS, DESTINATION_ADDRESS);
        } else {
            await swap(from, toIndex, amount, SOURCE_ADDRESS, SOURCE_ADDRESS);
        }
    }


    // DESTINATION으로 토큰 일괄 전송
    if(toSendCount > 1){
        const afterBalance = await getToTokenBalance()
        const amount = Big(afterBalance).toString()
        let tx;
        if(toIndex === 0){
            const vt = caver.transaction.valueTransfer.create({
                from: SOURCE_ADDRESS,
                to: DESTINATION_ADDRESS,
                value: amount,
                gas: 25000
            })

            tx = caver.wallet.sign(SOURCE_ADDRESS, vt).then(signed => {
                return caver.rpc.klay.sendRawTransaction(signed)
            })
        }
        else {
            const TO_TOKEN_CONTRACT = caver.contract.create(ERC20ABI, Tokens[toIndex].address)
            tx = await TO_TOKEN_CONTRACT
                .methods.transfer(DESTINATION_ADDRESS, amount)
                .send({
                    from: SOURCE_ADDRESS,
                    gas: 80000
                })
        }
        console.log(`${amount} ${Tokens[toIndex].name} transferred to ${DESTINATION_ADDRESS} (tx: ${tx.transactionHash})`)
        messageBox.add(`*[일괄 전송]* ${amount} ${Tokens[toIndex].name}가 ${DESTINATION_ADDRESS}으로 전송되었습니다.\n(tx: ${tx.transactionHash})`)
    }

    // KLEVA는 그냥 전송.
    await sendKleva();

    await messageBox.send()
}