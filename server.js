const express = require('express')
const bodyParser = require('body-parser')

let app = express()
let port = process.env.PORT || 3000
let routes = require('./api/routes/app-routes')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes.app(app)

app.listen(port)

//console.log('RESTful API server started on: ' + port)