<style>
.red {
  color: #f00;
}
</style>

<template>
<div>
  <v-navbar></v-navbar>
  <div class='center measure pt3 ph1'>
    <div class='ph3 pv3 mb4 bg-blue br2'>
      <h2 class='white f4'>Find a tournament</h2>
      <div class='dt'>
        <input 
          class='input-reset h2 pv0 ph2 lh-title bn bg-white br3--left'
          placeholder='Enter Tournament ID here'
        ></input>
        <div class='ph3 pointer bg-black-90 hover-bg-black-50 white dtc v-mid '>
          <span>Go</span>
        </div>
      </div>
    </div>
    <div v-if='loggedIn'>
      <div>
        <v-button 
          type='confirm'
          text='Create a Tournament'
          :onclick='createTournament'
        ></v-button>
      </div>
      <div v-for='tournament in state.upcomingTournaments'>
        <h3>{{tournament.name}}</h3>
        <span>{{tournament.startDate}}</span>
      </div>
    </div>
    <div v-else>
      <h3>Login to Create a Tournament</h3>
    </div>
  </div>
</div>
</template>

<script>
const moment = require('moment')
const xhr = require('xhr')
const styles = {

}

exports.methods = {
  createTournament: function () {
    this.$store.dispatch('route', {path: '/create-tournament'})
  }
}

exports.created = function () {
  const user = this.$store.state.user
  if (user.loggedIn) {
    this.$store.dispatch('home/fetchDashboard', {userId: user.userId})
  }
}

exports.computed = {
  loggedIn: function () {
    return this.$store.state.user.loggedIn
  }
}

exports.store = {
  state: {
    upcomingTournaments: []
  },
  actions: {
    fetchDashboard: function ({rootState, commit}, data) {
      const payload = {
        url: `/user/${data.userId}/dashboard`,
        json: true
      }
      xhr.get(payload, function (err, res) {
        if (!err) {
          commit('getDashboard', res.body)
        }
      })
    }
  },
  mutations: {
    getDashboard: function (state, dashboard) {
      state.upcomingTournaments = dashboard.upcomingTournaments.map(function (tournament) {
        tournament.startDate = moment(tournament.start).format('MMM D YYYY')
        console.log(tournament.startDate)
        return tournament
      })
    }
  }
}

exports.data = function () {
  return {
    styles
  }
}
</script>
