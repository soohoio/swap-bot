const { caver, multicall, Tokens, poolMap, ZERO_ADDRESS } = require("../swap.config")
const Big = require("big.js")
const ABI = require("../abi/klayswap.abi.json")


/**
 * 각 liquidity pool이 가지고 있는 유동성과 fee 비율을 가져온다.
 */
module.exports.getLiquidityAndFee = async function(){
    const N = Tokens.length

    /**
     * 먼저 각 lpPool이 가지고 있는 토큰의 유동성을 계산하여
     * 교환 비율을 얻는다.
     */

    // key: [tokenAaddress, tokenBaddress]
    const keys = []
    const methods = []

    for(let i = 0; i< N-1; i++){
        for (let j = i+1; j < N; j++) {

            const lpAddress = poolMap.poolAddress[i][j]
            if(lpAddress === ZERO_ADDRESS)
                continue;

            const lpContract = caver.contract.create(ABI.MockExchangeImpl, lpAddress)
            
            // 1번째: lp풀의 a토큰 주소 (a, b토큰 주소 확인용)
            // 2번째: lp풀의 a, b토큰 양
            // 3번째: lp풀의 수수료 비율
            keys.push([i, j])

            methods.push(lpContract.methods.tokenA())
            methods.push(lpContract.methods.getCurrentPool())
            methods.push(lpContract.methods.fee())
        }
    }

    const results = await multicall.aggregate(methods)

    /**
     * 
     * pools[i][j] = {i번째 토큰} - {j번째 토큰} 풀이 가지고 있는 {i번째 토큰} 유동성
     * ex) i=2 (oUSDT), j=3(KSP)일 때,
     * pools[2][3] = KlaySwap LP KSP-oUSDT 컨트랙트가 가지고 있는 oUSDT의 양
     * 
     * fees[i][j]: pools[i][j]의 수수료 BP
     */
    const liquidities = new Array(N).fill(0).map(() => new Array(N).fill(new Big(0)))
    const fees = new Array(N).fill(0).map(() => new Array(N).fill(0))
    
    for(let k = 0; k < keys.length; k++){
        const [i, j] = keys[k]

        const iToken = results.shift()
        const [poolA, poolB] = results.shift()
        const fee = results.shift()
        

        if(Tokens[i].address.toLowerCase() === iToken.toLowerCase()){
            liquidities[i][j] =  new Big(poolB)
            liquidities[j][i] = new Big(poolA)
        } else  {
            liquidities[i][j] =  new Big(poolA)
            liquidities[j][i] = new Big(poolB)
        }

        fees[i][j] = +fee
        fees[j][i] = +fee
    }

    return { liquidities, fees }

}