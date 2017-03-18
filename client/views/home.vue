<style>
.red {
  color: #f00;
}
</style>

<template>
<div>
  <v-navbar></v-navbar>
  <div class='center measure pt3 ph1'>
    <h3>Home</h3>
    <hr/>
    <div v-if='loggedIn'>
      <div v-for='tournament in state.upcomingTournaments'>
        <h3>{{tournament.name}}</h3>
      </div>
    </div>
    <div v-else>
      <h3>Login?</h3>
    </div>
  </div>
</div>
</template>

<script>
const xhr = require('xhr')
const styles = {

}

exports.methods = {
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
      state.upcomingTournaments = dashboard.upcomingTournaments
    }
  }
}

exports.data = function () {
  return {
    styles
  }
}
</script>
