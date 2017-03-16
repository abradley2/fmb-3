const xhr = require('xhr')

const user = {
  namespaced: true,
  state: {
    signedIn: false,
    username: '',
    token: ''
  },
  actions: {
    signin: function (ctx, username) {
      const payload = {
        url: '/user/signin',
        data: {username},
        json: true
      }
      xhr.post(payload, function (err, resp, body) {
        if (err || resp.statusCode >= 400) {
          const params = {
            component: 'error-modal',
            closeOnBgClick: true,
            props: {
              message: 'Login failed'
            }
          }
          ctx.commit('modal/openModal', params, {root: true})
          return
        }
        if (body.success) {
          ctx.commit('signin', {
            username,
            userId: body.userId,
            token: body.token,
            key: body.key
          })
          ctx.dispatch('route', {path: 'home'}, {root: true})
        }
      })
    }
  },
  mutations: {
    signin: function (state, {username, token}) {
      state.username = username
      state.signedIn = true
      state.token = token
    }
  }
}

module.exports = user
