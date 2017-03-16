const express = require('express')
const township = require('township')
const leveldb = require('../db/level')
const localConfig = require('../../local.config.json')
const authRoute = express.Router()

const ship = township(leveldb, {
  secret: localConfig.secret
})

authRoute.post('/register', function (req, res) {
  const log = req.app.locals.log

  ship.register(req, res, {body: req.body}, function (err, status, account) {
    if (err) {
      log.error({name: 'routes/auth/register'}, err.message, err)
      return res
        .status(400)
        .json({
          success: false,
          message: 'Registration Failed'
        })
    }
    log.info({name: 'routes/auth/register'}, req.body.email, 'register success!')
    return res.json({
      success: true,
      token: account.token,
      key: account.key
    })
  })
})

authRoute.post('/login', function (req, res) {
  ship.login(req, res, {body: req.body}, function (err, status, account) {
    if (err) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Login Failed'
        })
    }
    return res.json({
      success: true,
      token: account.token,
      key: account.key
    })
  })
})

module.exports = authRoute
