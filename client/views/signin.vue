<template>
<div>
  <v-navbar></v-navbar>
  <div class='measure center ph1'>
    <h3>Sign In</h3>
    <p>(This is just a prototype, so just a button for now)</p>
    <hr/>
    <v-button type='confirm' text='Submit' :onclick='signin'/></v-button>
  </div>
</div>
</template>

<script>
exports.store = {
  namespaced: true,
  state: {
    username: ''
  },
  mutations: {
    init: function (state) {
      state.username = ''
    },
    setUsername: function (state, username) {
      state.username = username
    }
  }
}

exports.created = function () {
  this.$store.commit('signin/init')
}

exports.methods = {
  setUsername: function (e) {
    this.$store.commit('signin/setUsername', e.target.value)
  },
  signin: function () {
    this.$store.dispatch('user/signin', this.username)
  }
}
</script>
