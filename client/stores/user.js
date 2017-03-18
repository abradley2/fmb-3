const xhr = require('xhr')

const user = {
  namespaced: true,
  state: {
    signedIn: false,
    username: '',
    token: '',
    key: ''
  },
  actions: {
    logout: function ({state, commit}) {
      const payload = {
        url: '/auth/logout',
        data: {
          token: state.token,
          key: state.key,
          username: state.username
        }
      }

      xhr.post(payload)
      commit('logout')
    },
    signin: function (ctx, {username, password}) {
      const payload = {
        url: '/auth/login',
        data: {
          email: username,
          password: password
        },
        json: true
      }
      xhr.post(payload, function (err, resp, body) {
        if (err || resp.statusCode >= 300) {
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
    signin: function (state, {username, token, key}) {
      state.username = username
      state.signedIn = true
      state.token = token
      state.key = key
    },
    logout: function (state) {
      state.username = ''
      state.signedIn = false
      state.token = ''
      state.key = ''
    }
  }
}

module.exports = user
