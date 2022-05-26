
/**
 * 
 * @param {{name: string, address: string}[]} tokens 
 * @param {string} FROM_TOKENS 
 * @param {string} TO_TOKEN 
 * @param {string} SLIPPAGE
 * @param {string} RESERVED_KLAY
 * @returns {{fromIndexes: number[], toIndex: number}}
 * 
 * 환경 변수로 들어오는 FROM_TOKENS과 TO_TOKEN의 name이 정확한지 검증한 후,
 * 해당 토큰들의 index를 리턴합니다.
 */
module.exports.envValidator = function(tokens, FROM_TOKENS, TO_TOKEN, SLIPPAGE, RESERVED_KLAY){
    if( isNaN(+SLIPPAGE) || +SLIPPAGE >= 1 || +SLIPPAGE < 0){
        throw Error(`Incorrect SLIPPAGE: ${SLIPPAGE}`)
    }

    if( isNaN(+RESERVED_KLAY) || RESERVED_KLAY < 1){
        throw Error(`RESERVED_KLAY should be more than 1 KLAY. (Current: ${RESERVED_KLAY})`)
    }
    
    const fromIndexes = [];
    FROM_TOKENS
        .split(",")
        .forEach(tokenName => {
            const idx = tokens.findIndex(t => t.name === tokenName.trim());
            if(idx === -1)
                throw Error(`Incorrect FROM_TOKENS name : ${tokenName.trim()}`);
            fromIndexes.push(idx);
        });
    
    const toIndex = tokens.findIndex(t => t.name === TO_TOKEN.trim());
    if(toIndex === -1)
        throw Error(`Incorrect TO_TOKEN name : ${TO_TOKEN}`)

    return {
        fromIndexes,
        toIndex
    }
}