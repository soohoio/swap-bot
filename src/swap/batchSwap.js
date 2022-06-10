const { caver,Tokens, ZERO_ADDRESS, RESERVED_KLAY, EOA } = require('../swap.config')
const Big = require('big.js')
const { envValidator } = require('../env-validators/env-validator')
const ERC20ABI = require("../abi/erc20.min.json")
const { swap } = require("./swap")


module.exports.batchSwap = async function(){
    const {fromIndexes, toIndex} = envValidator(
        Tokens,
        process.env.FROM_TOKENS,
        process.env.TO_TOKEN,
        process.env.SLIPPAGE,
        process.env.RESERVED_KLAY,
    )

    for await (const from of fromIndexes) {
        // 1. Get Token Balance
        const {name, address} = Tokens[from]
        let balance, amount;
        
        if(address !== ZERO_ADDRESS){   // ERC20 TOKEN
            balance = await caver.contract.create(ERC20ABI, address).methods.balanceOf(EOA).call()
            amount = Big(balance)
        } 
        else {                          // KLAY
            balance = await caver.klay.getBalance(EOA)
            amount = Big(balance).sub( Big(RESERVED_KLAY).mul(1E18) )
        }
        console.log(`\nBalance Of ${name} : ${balance}`)
        
        if(+amount <= 0)
            continue;

        await swap(from, toIndex, amount);
    }
}