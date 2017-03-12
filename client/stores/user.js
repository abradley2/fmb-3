const xhr = require('xhr')

const user = {
  state: {
    signedIn: false,
    username: '',
    token: ''
  },
  actions: {
    signin: function (ctx, username) {
      if (ctx.rootState.env.NODE_ENV === 'development') {
        ctx.commit('signin', {username: 'dev', token: 'dev'})
        ctx.dispatch('route', {path: 'home'}, {root: true})
        return
      }
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
            token: body.token
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
