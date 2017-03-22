<template>
<div>
  <v-navbar></v-navbar>
  <div class='center measure ph2 pt3'>
    <div :class='styles.qaGroup'>
      <div :class='styles.question'>
        What is the name of the tournament?
      </div>
      <div :class='styles.answer'>

      </div>
    </div>
    <div :class='styles.qaGroup'>
      <div :class='styles.question'>
        What bracket type?
      </div>
      <div :class='styles.answer'>

      </div>
    </div>
    <div :class='styles.qaGroup'>
      <div :class='styles.question'>
        Private, Public, or Registration?
      </div>
      <div :class='styles.answer'>

      </div>
    </div>
  </div>
</div>
</template>

<script>
const styles = {
  qaGroup: '',
  question: '',
  answer: ''
}

exports.methods = {

}

exports.store = {
  state: {

  },
  mutations: {

  },
  actions: {

  }
}

exports.data = function () {
  return {
    styles
  }
}
</script>
