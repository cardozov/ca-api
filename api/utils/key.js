
//--------------------> Exports
exports.create = () => {
    let key = ""

    for(let i = 0; key.length < 19; i++){
        if([4,8,12].indexOf(i) != -1 )
            key += '-'
        key += _getNewKeyChar()
    }

    return {pretty:key, original:key.split('-').join("")}
}

//--------------------> Private Functions
function _getNewKeyChar() {
    if(Math.random() >= 0.5)
        return "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]
    return parseInt(Math.random() * 10)
}