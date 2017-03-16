const express = require('express')
const api = express.Router()

api.get('/message', function (req, res) {
  return res.json({message: 'hello world!'})
})

api.use('/brackets', require('./routes/brackets'))

api.use('/user', require('./routes/user'))

api.use('/auth', require('./routes/auth'))

module.exports = api
