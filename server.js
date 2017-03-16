const http = require('http')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('corsify')
const log = require('pino')()
const app = express()

app.locals.log = log

app.use(bodyParser.urlencoded({extended: true}))

app.use(bodyParser.json())

app.use(express.static(
  path.join(__dirname, './public')
))

app.use(require('./api'))

const server = http.createServer(function (req, res) {
  if (process.env.NODE_ENV === 'development') return cors(app)(req, res)
  return app(req, res)
})

server.listen(3000, function () {
  log.info({name: 'server'}, 'server listening on port 3000')
})
