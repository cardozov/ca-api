
//--------------------> Module Imports
const fs = require('fs')
const keyManager = require("../utils/key")
const getmac = require('getmac')

//--------------------> Variables and Properties
const dbPath = `${__dirname}/../../DB.json`

//--------------------> Exports
exports.verifyAccess = (req, res) => {
    try{
        const mac = req.params.macAddress
        let data = _getFile(dbPath)
        let item = {}
        if(data || data.keys)
            item = data.keys.filter(x => x.mac == mac)
        res.json({result:item.length > 0})
    }
    catch(err){
        _errorHandler(res, err)
    }
}

exports.registerKey = (req, res) => {
    try {
        const mac = req.body.mac
        const key = req.body.key
        if(!getmac.isMac(mac))
            _errorHandler(res, "O endereço MAC fornecido não é válido")
        const err = _persistRegister(mac, key)
        if(err)
            _errorHandler(res, err)
        res.status(202).json({result:true})
    }
    catch(err){
        _errorHandler(res, err)
    }
}

exports.createKey = (req, res) => {
    try {
        if(!_authenticate(req.body.auth))
            _accessDenied(res)
        let key = _addNewKey(dbPath)
        if(!key)
            _errorHandler(res, "Sem acesso à base de dados.")

        res.status(201).json({key})
    } catch(err) {
        _errorHandler(res, err)
    }
}

exports.getAllUsedKeys = (req, res) => {
    try {
        res.json(_getKeysByCondition((mac) => {return mac != ""}))
    } catch (err) {
        _errorHandler(res, err)
    }
}

exports.getAllUnusedKeys = (req, res) => {
    try {
        if(!_authenticate(req.body.auth))
            _accessDenied(res)
        res.json(_getKeysByCondition((mac) => {return mac == ""}))
    } catch (err) {
        _errorHandler(res, err)
    }
}

//--------------------> Private Functions
function _addNewKey(path) {
    let data = _getFile(path)
    const newKey = keyManager.create()
    data.keys.push({
        key: newKey,
        mac: ""
    })

    _setFile(path, data)

    return newKey.pretty
}

function _isValidMac(mac) {
    return validator.isMACAddress(mac)
}

function _persistRegister(mac, key) {
    let data = _getFile(dbPath)
    if(!data || data.keys.length < 1)
        return "Chave inválida"
    let foundKey = false

    let item = data.keys.find(x => x.key.pretty == key)
    if(item == undefined)
        return "Chave inválida."
    if(item.mac == mac)
        return ""
    if(item.mac != "")
        return "Esta chave já foi utilizada anteriormente. \nAs chaves são permanentes e podem ser atreladas a uma única máquina."
    item.mac = mac

    _setFile(dbPath, data)
    return ""
}

function _getFile(path) {
    if(!fs.existsSync(path))
        _createFile(path)
    return JSON.parse(fs.readFileSync(path).toString())
}

function _setFile(path, content) {
    if(!fs.existsSync(path))
        _createFile(path)

    fs.writeFileSync(path, new Buffer.from(JSON.stringify(content)))
}

function _createFile(path) {
    fs.writeFileSync(path, new Buffer(JSON.stringify({keys:[],auths:[{user:"master",password:"m4573r"}]})))
}

function _getKeysByCondition(delegate) {
    const data = _getFile(dbPath).keys
    if(!data || !data.keys)
        _errorHandler(res, "Sem acesso à base de dados")
    return data.filter(x => delegate(x.mac))
}

function _authenticate(auth) {
    let data = _getFile(dbPath).auths
    const items = data.filter(x => x.user == auth.user && x.password == auth.password)
    return items.length > 0
}

function _errorHandler(res, err){
    res.status(500).json({text:"Um erro inesperado ocorreu", message:err})
}

function _accessDenied(res) {
    res.status(403).json({text:"Acesso negado", message:"As credenciais estão incorretas ou estão fora do prazo de validade"})
}