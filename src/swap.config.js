
const Caver = require("caver-js")
const Multicall = require("caver-multicall").default

const stage = process.env.STAGE;
module.exports.stage = stage;

const Tokens = stage === 'dev' 
    ? 
    require('../config/tokens-dev.json')
    :
    require('../config/tokens-prod.json')


module.exports.Tokens = Tokens;

module.exports.poolMap = stage === 'dev' 
    ? 
    require("../data/pools-dev.json")
    :
    require("../data/pools-prod.json")



module.exports.ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
module.exports.KLAYSWAP_ROUTER_ADDRESS = {
    dev: "0x8077d0aA6E5723D416fbB905Cf2ea866C8b4A399",
    prod: "0x73951cdC37C18A8CdED9b4bCc8fda7A3cd99fE0A",
}[stage]


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
            value: stage === 'dev' ? 1001 : 8217
        }, //Baobab: 1001
    ]
}

const provider = new Caver.providers.HttpProvider(process.env.NODE_URL, option)
module.exports.caver = new Caver(provider)
module.exports.multicall = new Multicall({
    network: stage === 'dev' ? 'baobab' : 'cypress',
    provider
})
