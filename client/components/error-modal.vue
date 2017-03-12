<template>
<div>
  <h3>Oops!</h3>
  <span>{{message}}</span>
</div>
</template>

<script>
exports.props = {
  message: {
    type: String,
    required: true
  }
}
</script>
