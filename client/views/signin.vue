<template>
<div>
  <v-navbar></v-navbar>
  <h3>Sign In</h3>
</div>
</template>

<script>
exports.methods = {
  signin: function () {
    this.$store.dispatch('user/signin', this.data.username, this.data.password)
  }
}
</script>
