const express = require('express')
const bracketsRoute = express.Router()

bracketsRoute.get('/', function (req, res) {
  res.json([])
})

module.exports = bracketsRoute
