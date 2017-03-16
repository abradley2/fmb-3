const express = require('express')
const moment = require('moment')
const userRoute = express.Router()

const mockDashboard = {
  upcomingTournaments: [
    {
      id: '1',
      name: 'Sample Tournanment A',
      start: moment().add(1, 'days').unix()
    }, {
      id: '2',
      name: 'Sample Tournament B',
      start: moment().add(5, 'days').unix()
    }
  ]
}

userRoute.get('/:userId/dashboard', function (req, res) {
  // give details to show the user her dashboard
  const response = process.env.NODE_ENV === 'development'
    ? mockDashboard
    : {}

  res.json(response)
})

module.exports = userRoute
