<template>
<div>
  <v-navbar></v-navbar>
  <div class='center measure'>
    <div class='tc'>
      <h3>Register for FMB</h3>
    </div>
    <hr />
    <div :class='styles.formBody'>
      <div :class='styles.section'>
        <div :class='styles.formGroup'>
          <label :class='styles.formLabel'>Username</label>
          <br/>
          <input
            type='username'
            :class='styles.formInput'
            @input='set("username", $event.target.value)'
            :value='state.username'
          />
        </div>
      </div>
      <div :class='styles.section'>
        <div :class='styles.formGroup'>
          <label :class='styles.formLabel'>Password</label>
          <br/>
          <input
            type='password'
            :class='styles.formInput'
            @input='set("password", $event.target.value)'
            :value='state.password'
          />
        </div>
      </div>
      <div :class='styles.section'>
        <div :class='styles.formGroup'>
          <label :class='styles.formLabel'>Confirm Password</label>
          <br/>
          <input
            type='password'
            :class='styles.formInput'
            @input='set("passwordConfirm", $event.target.value)'
            :value='state.passwordConfirm'
          />
        </div>
      </div>
      <div class='tc'>
        <v-button
          text='submit'
          type='confirm'
          :onclick='submitForm'
        ></v-button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
const xhr = require('xhr')

const styles = {
  section: 'flex justify-center',
  formGroup: 'mb4',
  formLabel: 'dib mb2',
  formInput: 'dib input-reset h2 ba b--black-80 br2'
}

exports.store = {
  state: {
    username: '',
    password: '',
    passwordConfirm: ''
  },
  mutations: {
    set: function (state, {attr, value}) {
      state[attr] = value
    }
  },
  actions: {
    registerUser: function ({dispatch, commit}, data) {
      const payload = {
        data: {
          email: data.username,
          passowrd: data.password
        },
        url: '/auth/register',
        json: true
      }
      xhr.post(payload, function (err, resp, body) {
        if (err) return
        if (body && body.success) {
          const info = {
            username: data.username,
            token: body.token,
            key: body.key
          }
          commit('user/login', info, {root: true})
          dispatch('route', {path: 'home'}, {root: true})
        }
      })
    }
  }
}

exports.methods = {
  set: function (attr, value) {
    this.$store.commit('register/set', {attr, value})
  },
  submitForm: function () {
    const payload = {
      username: this.username,
      password: this.password
    }
    this.$store.dispatch('register/registerUser', payload)
  }
}

exports.computed = {
  passwordMatch: function () {
    return this.password === this.passwordConfirm
  }
}

exports.data = function () {
  return {
    styles
  }
}
</script>
