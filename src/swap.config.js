
const Caver = require("caver-js")
const Multicall = require("caver-multicall").default


module.exports.stage = process.env.STAGE

const Tokens = (module.exports.stage === 'dev')
    ? 
    require('../config/tokens-dev.json')
    :
    require('../config/tokens-prod.json')



module.exports.Tokens = Tokens;

module.exports.poolMap = module.exports.stage === 'dev' 
    ? 
    require("../data/pools-dev.json")
    :
    require("../data/pools-prod.json")



module.exports.ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
module.exports.KLAYSWAP_ROUTER_ADDRESS = {
    dev: "0x6672074f6D1EF04C0E03Ef7F134bE784638D7A4f",
    prod: "0x6672074f6D1EF04C0E03Ef7F134bE784638D7A4f",
}[module.exports.stage]


const option = {
    headers: [
        {
            name: 'Authorization', 
            value: 'Basic ' + Buffer.from(
                process.env.KAS_ACCESS_KEY_ID + ':' + process.env.KAS_SECRET_ACCESS_KEY
            ).toString('base64')
        },
        {
            name: 'x-chain-id', 
            value: module.exports.stage === 'dev' ? 1001 : 8217
        }, //Baobab: 1001
    ]
}

const provider = new Caver.providers.HttpProvider(process.env.NODE_URL, option)
module.exports.caver = new Caver(provider)
module.exports.multicall = new Multicall({
    network: module.exports.stage === 'dev' ? 'baobab' : 'cypress',
    provider
})

module.exports.RESERVED_KLAY = +process.env.RESERVED_KLAY