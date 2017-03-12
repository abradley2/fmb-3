const xhr = require('xhr')

const user = {
  namespace: 'user',
  state: {
    signedIn: false,
    username: '',
    token: ''
  },
  actions: {
    signin: function (ctx, {username, password}) {
      const payload = {
        url: '/user/signin',
        data: {
          username,
          password
        },
        json: true
      }
      xhr.post(payload, function (err, resp, body) {
        if (err || resp.status >= 400) {
          const params = {
            component: 'error-modal',
            closeOnBgClick: true,
            props: {
              message: 'Login failed'
            }
          }
          ctx.commit('modal/showModal', params, {root: true})
          return
        }
        if (body.success) {
          ctx.commit('signin', {
            username,
            token: body.token
          })
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
