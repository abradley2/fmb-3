<template>
  <v-navbar></v-navbar>
</template>

<script>
exports.methods = {
  signin: function () {
    this.$store.dispatch('user/signin', this.data.username, this.data.password)
  }
}

exports.store = {
  namespace: 'signin'
}
</script>
