const express = require('express')
const api = express.Router()

api.get('/message', function (req, res) {
  return res.json({message: 'hello world!'})
})

api.use('/brackets', require('./routes/brackets'))

module.exports = api
