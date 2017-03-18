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
  </div>
</div>
</template>

<script>
const xhr = require('xhr')

exports.methods = {
}

exports.created = function () {
  const user = this.$store.state.user
  if (user.signedIn) {
    this.$store.dispatch('home/fetchDashboard', {userId: user.userId})
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
</script>
