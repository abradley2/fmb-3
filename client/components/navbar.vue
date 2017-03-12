<template>
  <nav class='flex justify-between bg-black-90'>
    <span
      class='link white-70 hover-white flex items-center ph3 pointer'
      v-on:click=''
    >
        <i class='fa fa-2x fa-bars'></i>
    </span>
    <div class='pa3 flex items-center'>
      <a :class='styles.link' href='#signin'>Sign In</a>
      <a 
        :class='styles.signinLink'
        href='#0'>
          Sign Up
      </a>
    </div>
  </nav>
</template>

<script>
exports.methods = {
  toggleMenu: function () {
    this.data.menuOpen = !this.data.menuOpen
  }
}

exports.data = function () {
  return {
    styles: {
      link: 'f6 link white dim mr3 mr4-ns',
      signinLink: 'f6 link white bg-animate hover-bg-white hover-black pv2 ph4 br-pill ba b--white-20'
    },
    menuOpen: false
  }
}
</script>
