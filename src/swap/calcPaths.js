const { calcPos } = require("./calcPos")

module.exports.calcPaths = function (amount, paths, pools, fees){

    let res = []
    for (const path of paths) {
        let currAmount = amount;
        for (let i = 0; i < path.length - 1; i++) {
            const [currToken, nextToken] = [path[i], path[i+1]];
            currAmount = calcPos(
                currAmount, 
                pools[nextToken][currToken],
                pools[currToken][nextToken],
                fees[currToken][nextToken]
            );
        }
        
        res.push({
            path,
            amount: currAmount.toNumber()
        })
    }


    // 내림차순 정렬
    const sorted = res.sort((a, b) => b.amount - a.amount)
    const optimal = sorted[0].amount

    const filtered = sorted.map(res => ({...res, difference: 1 - res.amount / optimal}))


    return filtered.slice(0,10).map(r => ({...r, amount: r.amount.toString()}))
}

