module.exports.CONFIG = (serverless) => ({
    dev: {
        NODE_URL: 'https://node-api.klaytnapi.com/v1/klaytn',
        KAS_ACCESS_KEY_ID: '<KAS_ACCESS_KEY_ID>',
        KAS_SECRET_ACCESS_KEY: '<KAS_SECRET_ACCESS_KEY>',
        SOURCE_ADDRESS: '<SOURCE_ADDRESS>',
        SOURCE_PRIVATE_KEY: '<SOURCE_PRIVATE_KEY>',
        DESTINATION_ADDRESS: '<DESTINATION_ADDRESS>',
        FROM_TOKENS: "oETH,WEMIX,KDAI,KSP,KLAY",
        TO_TOKEN: "oUSDT",
        SLIPPAGE: 0.003,
        RESERVED_KLAY: 50,   // 50 KLAY
        WKLAY_ADDRESS: "0xBFD8eB155A69189C6e5d0c679a90b0350E8f5506"  // optional
    },
    prod: {
        NODE_URL: 'https://node-api.klaytnapi.com/v1/klaytn',
        KAS_ACCESS_KEY_ID: '<KAS_ACCESS_KEY_ID>',
        KAS_SECRET_ACCESS_KEY: '<KAS_SECRET_ACCESS_KEY>',
        SOURCE_ADDRESS: '<SOURCE_ADDRESS>',
        SOURCE_PRIVATE_KEY: '<SOURCE_PRIVATE_KEY>',
        DESTINATION_ADDRESS: '<DESTINATION_ADDRESS>',
        FROM_TOKENS: "oETH,WEMIX,KDAI,KSP,KLAY",
        TO_TOKEN: "oUSDT",
        SLIPPAGE: 0.003,
        RESERVED_KLAY: 50,  // 50 KLAY
        WKLAY_ADDRESS: "0xF6F6b8Bd0aC500639148f8ca5a590341A97De0DE"  // optional
    }
});