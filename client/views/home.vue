<template>
<div>
  <v-navbar></v-navbar>
  <div class='center measure pt3 ph2'>
    <div class='ph3 pv3 mb4 bg-blue br2 flex-column items-center justify-center'>
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
      <div class='tc'>
        <v-button 
          type='confirm'
          text='Create a Tournament'
          :onclick='createTournament'
        ></v-button>
      </div>
      <div>
        <hr/>
        <p v-if='state.upcomingTournaments.length > 0'
          class='black-80'
        >
          You are participating in the following events:
        </p>
        <p v-if='state.upcomingTournaments.length < 1'
          class='black-80'
        >
          You have no upcoming events
        </p>
      </div>
      <div class='mt4'>
        <div 
          v-for='tournament in state.upcomingTournaments'
          class='bl bb b--black-80 pa1 mb4'
        >
          <a
            :href='"#/tournament/" + tournament.id'
            class='db mb3 fh3 link blue'
          >
            {{tournament.name}}
          </a>
          <span>{{tournament.startDate}}</span>
        </div>
      </div>
    </div>
    <div v-else>
      <hr/>
      <h3>Login to Create a Tournament</h3>
    </div>
  </div>
</div>
</template>

<script>
const {months} = require('../utils')
const getMonth = require('date-fns/get_month')
const getDate = require('date-fns/get_date')
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
    this.$store.dispatch('home/fetchDashboard', {userId: user.key})
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
        const date = new Date(tournament.start)

        tournament.startDate = `${months[getMonth(date)]}, ${getDate(date)}`
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
