<style>
  .red {
    color: #f00;
  }
</style>

<template>
  <div class='container'>
    {{state.message}}
    <button id='click-me' v-on:click='fetchMessage'>
      Fetch Message
    </button>
    <h3>{{state.message}}</h3>
    <div>
      <span class='red' id='find-me'>
        Text Content
      </span>
    </div>
  </div>
</template>

<script>
const xhr = require('xhr')

exports.methods = {
  fetchMessage: function () {
    this.$store.dispatch('home/fetchMessage')
  }
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
      xhr.get({
        url: '/message',
        json: true
      }, function (err, res) {
        if (!err) {
          commit('getMessage', res.body.message)
        }
      })
    }
  },
  mutations: {
    getMessage: function (state, message) {
      state.message = message
    }
  }
}
</script>
