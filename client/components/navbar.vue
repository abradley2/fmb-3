<template>
  <nav class='flex justify-between bg-black-90'>
    <div class='flex items-center'>
      <span
        :class='styles.navIcon'
        @click='toggleMenu'
      >
          <i class='fa fa-2x fa-bars'></i>
      </span>
      <a
        :class='styles.navIcon'
        href='#/home'
      >
          <i class='fa fa-2x fa-home'></i>
      </a>
    </div>
    <div class='pa3 flex items-center'>
      <a :class='styles.link' href='#/signin'>Sign In</a>
      <a 
        :class='styles.signinLink'
        href='#/signup'>
          Sign Up
      </a>
    </div>
  </nav>
</template>

<script>
exports.methods = {
  toggleMenu: function () {
    this.menuOpen = !this.menuOpen
  }
}

exports.data = function () {
  return {
    styles: {
      navIcon: 'link dib white-70 hover-white ph3 pointer',
      link: 'f6 link white dim mr3 mr4-ns',
      signinLink: 'f6 link white bg-animate hover-bg-white hover-black pv2 ph4 br-pill ba b--white-20'
    },
    menuOpen: false
  }
}
</script>
