const { ZERO_ADDRESS, Tokens, poolMap } = require('../swap.config')


// breadth first search
// node(토큰) 중복 방문 불가능
module.exports.searchPaths = function(from, to){
    const N = Tokens.length
    const queue = [
        {
            curr: from,
            path: [from]
        }
    ]

    const paths = []

    while(queue.length > 0){
        const history = queue.shift()
        if(history.curr === to){
            paths.push(history.path)
            continue;
        }

        for(let j=0; j<N; j++){
            let lpAddress = poolMap.poolAddress[history.curr][j]
            // 연결된 edge(pool)이 없거나 이미 방문한 노드이면 queue에 넣지 않음
            if(lpAddress === ZERO_ADDRESS || history.path.includes(j))
                continue;

            queue.push({
                curr: j,
                path: history.path.concat([j])
            })
        }
    }


    return paths;
}