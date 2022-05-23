const Caver = require("caver-js")
const Multicall = require("caver-multicall").default
const KlayswapABI = require("../abi/klayswap.abi.json")
const { KLAYSWAP_ROUTER_ADDRESS, ZERO_ADDRESS, Tokens, stage } = require("../swap.config")
const { writeFile } = require('../utils/writeFile')
const { tokensValidator } = require("../env-validators/tokens-validator")


// update pool은 편의상 public node 활용하여 진행
const PUBLIC_NODES = {
    dev: "https://public-node-api.klaytnapi.com/v1/baobab",
    prod: "https://public-node-api.klaytnapi.com/v1/cypress"
}


const provider = new Caver.providers.HttpProvider(PUBLIC_NODES[stage])
const caver = new Caver(provider)
const multicall = new Multicall({
    network: stage === 'dev' ? 'baobab' : 'cypress',
    provider
})

/**
 * @dev 
 * KlaySwap의 pool 목록을 가져와 관련 정보를 @data/pools-{stage}.json에 저장한다.
 * 
 **** pools.json ****
 * @property 
 * pools[i][j] = {i번째 토큰} - {j번째 토큰} pool의 address
 * @property 
 * reversedMap[address] = [i, j]
 * (assert i < j)
 * 
 */
async function updatePools(){
    const routerContract = caver.contract.create(KlayswapABI.KlayswapRouter, KLAYSWAP_ROUTER_ADDRESS)

    let poolMap = {
        poolAddress: new Array(Tokens.length)
            .fill(0)
            .map(() => 
                new Array(Tokens.length).fill(ZERO_ADDRESS)
            ),
        reversedMap: {}
    }

    const tokenPairs = []
    const methods = []


    for (let i = 0; i < Tokens.length - 1; i++) {
        const {address: Aaddress} = Tokens[i];
        for (let j = i+1; j < Tokens.length; j++) {
            const {address:Baddress} = Tokens[j];
            tokenPairs.push([i, j])
            methods.push(routerContract.methods.getLpTokenAddress(Aaddress, Baddress))
        }
    }
    
    const lpAddresses = await multicall.aggregate(methods)

    for(let t=0; t < tokenPairs.length; t++){
        const [i, j] = tokenPairs[t];
        const lpAddress = lpAddresses[t]
        if(lpAddress !== ZERO_ADDRESS){
            poolMap.poolAddress[i][j] = lpAddress;
            poolMap.poolAddress[j][i] = lpAddress;
            poolMap.reversedMap[lpAddress] = [i, j]
        }
    }

    writeFile(`data/pools-${stage}.json`, JSON.stringify(poolMap, undefined, 2), false)
}

tokensValidator(caver, multicall, Tokens)
updatePools()