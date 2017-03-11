<style>
  .red {
    color: #f00;
  }
</style>

<template>
  <div class=''>
    <button v-on:click='$store.dispatch("home/fetchMessage")'>Fetch Message</button>
    <h3>{{state.message}}</h3>
  </div>
</template>

<script>
const xhr = require('xhr')

exports.methods = {
}

exports.store = {
  namespace: 'home',
  state: {
    filter: 'all',
    newTodo: 'New Todo',
    todos: [],
    message: ''
  },
  actions: {
    fetchMessage: function ({commit}) {
      console.log(this)
      xhr.get({
        url: '/message',
        json: true
      }, function (err, res) {
        if (!err) {
          commit('getMessage', res)
        }
      })
    }
  },
  mutations: {
    getMessage: function (state, res) {
      state.message = res.body.message
    }
  }
}
</script>
