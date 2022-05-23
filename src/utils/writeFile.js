const fs = require('fs')

module.exports.writeFile = function(path, data, append){
    const dir = path.split('/').slice(0, -1).join('/')
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir, {recursive: true})
    }
    fs.writeFileSync(
        path, 
        data, 
        {encoding: 'utf-8', flag: append ? 'a' :'w'}
    )
}