const express = require('express')
const userRoute = express.Router()

const day = 86400000

const mockDashboard = {
  upcomingTournaments: [
    {
      id: '1',
      name: 'Sample Tournanment A',
      start: Date.now() + (day * 2)
    }, {
      id: '2',
      name: 'Sample Tournament B',
      start: Date.now() + (day * 14)
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
