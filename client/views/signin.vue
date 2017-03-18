<template>
<div>
  <v-navbar></v-navbar>
  <div class='measure center ph1'>
    <div class='tc'>
      <h3>Sign In</h3>
    </div>
    <hr/>
    <div :class='styles.section'>
      <div :class='styles.formGroup'>
        <label :class='styles.formLabel'>Username</label>
        <br/>
        <input
          type='text'
          :class='styles.formInput'
          v-model='username'
        />
      </div>
      <div :class='styles.formGroup'>
        <label :class='styles.formLabel'>Password</label>
        <br/>
        <input
          type='password'
          :class='styles.formInput'
          v-model='password'
        />
      </div>
    </div>
    <div class='tc'>
      <v-button type='confirm' text='Submit' :onclick='signin'/></v-button>
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
}

exports.methods = {
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
