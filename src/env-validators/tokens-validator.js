const { ZERO_ADDRESS } = require("../swap.config")
const ERC20ABI = require("../abi/erc20.min.json")


module.exports.tokensValidator = async function(caver, multicall, tokens){
    // check if all token names are unique
    const uniqueTokenCount = tokens.filter((t, i, arr) => {
        return arr.findIndex(a => a.name === t.name) === i
    }).length

    if(uniqueTokenCount !== tokens.length)
        throw Error("Duplicated token exists.")
        
    // Check if Tokens[0] is KLAY.
    if(tokens[0].name !== "KLAY" || tokens[0].address !== ZERO_ADDRESS)
        throw Error(`You must place the \n\n${JSON.stringify({
            name: "KLAY",
            address: ZERO_ADDRESS
        }, undefined, 2)}\n\nnat Tokens[0] in tokens.dev.json and tokens.production.json.`)

    const symbols = await multicall.aggregate(
        tokens.slice(1)
            .map(({name, address}) => {
                const contract = caver.contract.create(ERC20ABI, address)
                return contract.methods.symbol()
            })
    )

    for(let i=1; i < tokens.length; i++){
        if(tokens[i].name !== symbols[i-1])
            throw Error(`The token name "${tokens[i].name}" is incorrect, Please change the token name to "${symbols[i-1]}"`)
    }
}