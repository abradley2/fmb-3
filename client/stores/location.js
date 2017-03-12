const location = {
  namespace: 'location',
  state: {
    prev: '',
    cur: window ? window.location.hash : ''
  },
  mutations: {
    route: function (to, from) {
      this.state.prev = from
      this.state.cur = to
    }
  }
}

module.exports = location
