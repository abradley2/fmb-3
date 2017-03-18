<template>
<div class='tc'>
  <h3>Oops!</h3>
  <span>{{message}}</span>
  <br/>
  <div class='absolute bottom-1 tc w-100'>
    <v-button class='mt3' :onclick='clickClose' text='Close'></v-button>
  </div>
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
