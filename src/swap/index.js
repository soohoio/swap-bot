const { caver,Tokens, ZERO_ADDRESS, RESERVED_KLAY } = require('../swap.config')
const { searchPaths } = require('./searchPaths')
const { getLiquidityAndFee } = require('./getLiquidityAndFee')
const { calcPaths } = require('./calcPaths')
const Big = require('big.js')
const { envValidator } = require('../env-validators/env-validator')
const ERC20ABI = require("../abi/erc20.min.json")
const { swapCall } = require('./swapCall')


module.exports.swap = async function(){
    const {fromIndexes, toIndex} = envValidator(
        Tokens,
        process.env.FROM_TOKENS,
        process.env.TO_TOKEN,
        process.env.SLIPPAGE,
        process.env.RESERVED_KLAY,
    )

    const EOA = process.env.EOA_ADDRESS;

    for await (const from of fromIndexes) {
        // 1. Get Token Balance
        const {name, address} = Tokens[from]
        let balance;
        // ERC20 TOKEN
        if(address !== ZERO_ADDRESS){
            balance = await caver.contract.create(ERC20ABI, address).methods.balanceOf(EOA).call()
            console.log(`Balance Of ${name} : ${balance}`)
        } 
        // KLAY
        else {
            balance = await caver.klay.getBalance(EOA)
            console.log(`Balance Of ${name} : ${balance}`)
        }

        if(!+balance)
            continue;

        const paths = searchPaths(from, toIndex)
        if(paths.length === 0 || paths[0].length < 2){
            console.log(`Path from ${Tokens[from].name} to ${Tokens[toIndex].name} not exists.`);
            continue;
        }

        const {liquidities, fees} = await getLiquidityAndFee()

        const amount = Big(balance).sub(RESERVED_KLAY)
    
        const output = calcPaths(amount, paths, liquidities, fees);
        const now = new Date()
        // 3분 뒤
        now.setMinutes(now.getMinutes()+3)

        // SWAP CALL 손보기!
        await swapCall(
            EOA,
            amount.toString(),
            Big(output[0].amount).mul(1 - +process.env.SLIPPAGE).round().toString(),
            output[0].path,
            now
        )

        console.log(output[0])
    }
}