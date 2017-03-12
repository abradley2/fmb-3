<template>
<div
  v-if='modal.show'
  @click='bgClick'
  class='fixed absolute--fill bg-black-30 pointer'
>
  <div
    @click='stopEvent'
    class='measure center cursor-auto br3 bg-white modal mt5 mt6-ns pv2 ph3'
  >
    <!-- For every possible modal that can be displayed, add it below -->
    <v-error-modal
      v-if='modal.component === "error-modal"'
      :message='modal.props.message'
    ></v-error-modal>
  </div>
</div>
</template>

<style>
.cursor-auto {
  cursor: auto;
}
.modal {
  min-height: 300px;
}
</style>

<script>
exports.computed = {
  modal: function () {
    return this.$store.state.modal
  }
}

exports.methods = {
  stopEvent: function (e) {
    e.stopPropagation()
  },
  bgClick: function () {
    if (this.$store.state.modal.closeOnBgClick) {
      this.$store.commit('modal/closeModal')
    }
  }
}
</script>
