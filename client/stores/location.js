const location = {
  state: {
    prev: '',
    cur: window ? window.location.hash : ''
  },
  mutations: {
    setRoute: function (state, {to, from}) {
      state.prev = from
      state.cur = to
    }
  }
}

module.exports = location
