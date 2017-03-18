const {pick} = require('../utils')

const location = {
  namespaced: true,
  state: {
    prev: '',
    cur: window ? window.location.hash : ''
  },
  mutations: {
    setRoute: function (state, {to, from}) {
      state.prev = pick(from, ['path', 'fullPath', 'hash'])
      state.cur = pick(from, ['path', 'fullPath', 'hash'])
    }
  }
}

module.exports = location
