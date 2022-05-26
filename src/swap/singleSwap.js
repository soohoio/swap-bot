const Big = require('big.js')
const { caver,Tokens, ZERO_ADDRESS, EOA } = require('../swap.config')
const ERC20ABI = require("../abi/erc20.min.json")
const { swap } = require('./swap')



/**
 * 
 * @param {string} from 교환 전 토큰 이름
 * @param {string} to   교환 후 토큰 이름
 * @param {string} amount   교환 토큰 양 (교환 전 토큰 기준) 
 */
module.exports.singleSwap = async function(){
    const from = process.env.from
    const to = process.env.to
    const amount = process.env.amount


    // 1. Get Token Index
    const fromIndex  = Tokens.findIndex(t => t.name === from)
    if(fromIndex === -1)
        throw Error(`From token name ${from} is not correct.`)
    
    const toIndex  = Tokens.findIndex(t => t.name === to)
    if(toIndex === -1)
        throw Error(`To token name ${to} is not correct.`)



    let balance;
    if(Tokens[fromIndex].address !== ZERO_ADDRESS){  // ERC20 TOKEN
        balance = await caver.contract.create(ERC20ABI, Tokens[fromIndex].address).methods.balanceOf(EOA).call()
    } else {  // KLAY
        balance = await caver.klay.getBalance(EOA)
    }

    console.log(balance)


    if(+amount > +balance)
        throw Error("Insufficient balance")

    await swap(fromIndex, toIndex, Big(balance))
}