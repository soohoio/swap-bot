module.exports.CONFIG = (serverless) => ({
    dev: {
        NODE_URL: 'https://node-api.klaytnapi.com/v1/klaytn',
        KLAYTNSCOPE_TX_URL: 'https://baobab.scope.klaytn.com/tx/',
        KAS_ACCESS_KEY_ID: 'KASKLNDS56IQRNU185CJLPT7',
        KAS_SECRET_ACCESS_KEY: 'FM71pYttUOGyB9NbCZGmli0wKfR6cj8Bu34TZzfr',
        EOA_ADDRESS: '0x1a864fc2299115c41e2bffbd29e33124b612554d',
        EOA_PRIVATE_KEY: '0xf99a6a056deecdbfa989e4e699ba39d7ecac58d954324ee22ddcf8b9d3660fb1',
        FROM_TOKENS: "KLAY,MKUSDT,MKDAI,MWEMIX,MKETH",
        TO_TOKEN: "MKUSDT",
        SLIPPAGE: 0.003,
        RESERVED_KLAY: 50
    },
    prod: {
        NODE_URL: 'https://node-api.klaytnapi.com/v1/klaytn',
        KLAYTNSCOPE_TX_URL: 'https://scope.klaytn.com/tx/',
        KAS_ACCESS_KEY_ID: 'KASKLNDS56IQRNU185CJLPT7',
        KAS_SECRET_ACCESS_KEY: 'FM71pYttUOGyB9NbCZGmli0wKfR6cj8Bu34TZzfr',
        EOA_ADDRESS: '0xc6ffa5c7ad9c7f46a6f61c04b495c4cc7c77cd33',
        EOA_PRIVATE_KEY: '0xc984eaad7b633960361153bf0af7f5d7810ed5a54b2ed6ac83d91925ff98d420',
        FROM_TOKENS: "oETH,WEMIX,KDAI,KSP,KLAY",
        TO_TOKEN: "oUSDT",
        SLIPPAGE: 0.003,
        RESERVED_KLAY: 3
    }
});