<template>
<div>
  <v-navbar></v-navbar>
  <div class='measure center ph1'>
    <h3>Sign In</h3>
    <hr/>
    <div :class='styles.formGroup'>
      <label :class='styles.formLabel'>Email</label>
      <input
        type='email'
        :class='styles.formInput'
        v-model='email'
      />
    </div>
    <div :class='styles.formGroup'>
      <label :class='styles.formLabel'>Password</label>
      <input
        type='password'
        :class='styles.formInput'
        v-model='password'
      />
    </div>
    <v-button type='confirm' text='Submit' :onclick='signin'/></v-button>
  </div>
</div>
</template>

<script>
const styles = {
  formGroup: 'mb4',
  formLabel: 'db mb2',
  formInput: 'db input-reset h2 ba b--black-80 br2'
}

exports.store = {
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
    const payload = {
      username: this.username,
      password: this.password
    }
    this.$store.dispatch('user/signin', payload)
  }
}

exports.data = function () {
  return {
    password: '',
    username: '',
    styles
  }
}
</script>
