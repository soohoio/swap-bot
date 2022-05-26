module.exports.CONFIG = (serverless) => ({
    dev: {
        NODE_URL: 'https://node-api.klaytnapi.com/v1/klaytn',
        KAS_ACCESS_KEY_ID: '<KAS_ACCESS_KEY_ID>',
        KAS_SECRET_ACCESS_KEY: '<KAS_SECRET_ACCESS_KEY>',
        EOA_ADDRESS: '<EOA_ADDRESS>',
        EOA_PRIVATE_KEY: '<EOA_PRIVATE_KEY>',
        FROM_TOKENS: "oETH,WEMIX,KDAI,KSP,KLAY",
        TO_TOKEN: "oUSDT",
        SLIPPAGE: 0.003,
        RESERVED_KLAY: 50
    },
    prod: {
        NODE_URL: 'https://node-api.klaytnapi.com/v1/klaytn',
        KAS_ACCESS_KEY_ID: '<KAS_ACCESS_KEY_ID>',
        KAS_SECRET_ACCESS_KEY: '<KAS_SECRET_ACCESS_KEY>',
        EOA_ADDRESS: '<EOA_ADDRESS>',
        EOA_PRIVATE_KEY: '<EOA_PRIVATE_KEY>',
        FROM_TOKENS: "oETH,WEMIX,KDAI,KSP,KLAY",
        TO_TOKEN: "oUSDT",
        SLIPPAGE: 0.003,
        RESERVED_KLAY: 50
    }
});