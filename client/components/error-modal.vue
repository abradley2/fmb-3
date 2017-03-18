<template>
<div class='tc'>
  <h3>Oops!</h3>
  <span>{{message}}</span>
  <br/>
  <v-button class='mt3' :onclick='clickClose' text='Close'></v-button>
</div>
</template>

<script>
exports.props = {
  message: {
    type: String,
    required: true
  }
}

exports.methods = {
  clickClose: function () {
    this.$store.commit('modal/closeModal')
  }
}
</script>
