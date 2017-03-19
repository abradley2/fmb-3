<template>
<div>
  <v-navbar></v-navbar>
  <div class='measure center ph1'>
    <div class='tc'>
      <h3>Login</h3>
    </div>
    <hr/>
    <div :class='styles.section'>
      <div :class='styles.formGroup'>
        <label :class='styles.formLabel'>Username</label>
        <br/>
        <input
          type='text'
          :class='styles.formInput'
          @input='set("username", $event.target.value)'
          :value='state.username'
        />
      </div>
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
    <div class='tc'>
      <v-button type='confirm' text='Submit' :onclick='login'/></v-button>
    </div>
  </div>
</div>
</template>

<script>
const styles = {
  section: 'flex flex-column items-center',
  formGroup: 'mb4',
  formLabel: 'mb2',
  formInput: 'input-reset h2 ba b--black-80 br2'
}

exports.store = {
  state: {
    username: '',
    password: ''
  },
  mutations: {
    set: function (state, {attr, value}) {
      state[attr] = value
    }
  }
}

exports.methods = {
  set: function (attr, value) {
    this.$store.commit('login/set', {attr, value})
  },
  login: function () {
    const payload = {
      username: this.state.username,
      password: this.state.password
    }
    this.$store.dispatch('user/login', payload)
  }
}

exports.data = function () {
  return {
    styles
  }
}
</script>
