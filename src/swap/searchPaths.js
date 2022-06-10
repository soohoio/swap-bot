const { ZERO_ADDRESS, Tokens, poolMap, stage } = require('../swap.config')

// 스왑 토큰 최대 경로 수
const PATH_LIMIT = 4;

// breadth first search
// node(토큰) 중복 방문 불가능
module.exports.searchPaths = function(from, to){
    const N = Tokens.length
    const queue = [ [from] ]
    const paths = []

    try {
        while(queue.length > 0){
            const history = queue.shift()
            const curr = history[history.length-1]
            if(curr === to){
                paths.push(history)
                continue;
            }
            
    
            for(let j=0; j<N; j++){
                let lpAddress = poolMap.poolAddress[curr][j]
                // 연결된 edge(pool)이 없거나 이미 방문한 노드이면 queue에 넣지 않음
                if(lpAddress === ZERO_ADDRESS || history.includes(j) || history.length >= PATH_LIMIT)
                    continue;

                queue.push(history.concat([j]))
            }
        }
    } catch (error) {
        console.log("\x1b[31m", '\n\nPool 업데이트를 먼저 진행해주세요.\n')
        console.log("\x1b[32m", `  >  npm run update:${stage}\n`, '\x1b[0m')
        throw Error()
    }

    return paths;
}