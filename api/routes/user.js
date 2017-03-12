const express = require('express')
const userRoute = express.Router()

userRoute.get('/:userId/dashboard', function (req, res) {
  // give details to show the user her dashboard
  res.json([
    {
      id: '1',
      name: 'Sample Tournament A'
    }, {
      id: '2',
      name: 'Sample Tournament B'
    }
  ])
})

module.exports = userRoute
