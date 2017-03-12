const user = {
  namespace: 'user',
  state: {
    signedIn: false
  },
  actions: {
    signin: function () {
      console.log('sign in = ', this)
    }
  },
  mutations: {
    signin: function () {

    }
  }
}

module.exports = user
