<template>
  <span
    :class='buttonClass'
    @click='onclick'
  >
    {{text}}
  </span>
</template>

<script>
exports.data = function () {
  const buttonClass = {
    default: 'bg-white black',
    confirm: 'bg-blue white'
  }[this.type] + ' grow f4 ph3 pv2 dib pointer br2 ba bw1 shadow-1'

  return {buttonClass}
}

exports.props = {
  type: {
    required: false,
    default: 'default',
    type: String
  },
  text: {
    required: true,
    type: String
  },
  onclick: {
    required: true,
    type: Function
  }
}
</script>
