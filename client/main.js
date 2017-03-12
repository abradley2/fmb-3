const Vue = require('vue')
const Vuex = require('vuex')
const Router = require('vue-router')
const xhr = require('xhr')
const app = require('./app.vue')
const {omit} = require('./utils')

const routes = []
const stores = {
  state: {},
  modules: {}
}

Vue.use(Router)
Vue.use(Vuex)

// initialize al view modules
initModule(['/', '/home'], require('./views/home.vue'))
initModule(['/signin'], require('./views/signin.vue'))

// initialize all components
Vue.component('v-navbar', require('./components/navbar.vue'))

// initialize all stores
initStore(require('./stores/env'))
initStore(require('./stores/user'))

// App start
const router = new Router({routes})
const store = new Vuex.Store(stores)

new Vue({
  router,
  store,
  render: function (createElement) {
    return createElement(app)
  }
}).$mount('#app')

// function to init a module and have it's routes/stores/component added to the app
function initModule (paths, config) {
  const store = config.store
  const namespace = store.namespace
  const view = initView(namespace, config)
  initRoute(paths, view)
  initStore(store)
}

// initialize the route of a module
function initRoute (path, component) {
  if (Array.isArray(path)) {
    return path.map(function (p) {
      return initRoute(p, component)
    })
  }
  routes.push({path, component})
}

// for convenience, give every vue a computed that has access to it's store
function initView (namespace, config) {
  config.computed = config.computed || {}
  config.computed.state = function () {
    return this.$store.state[namespace]
  }
  return omit(config, 'store')
}

// for convenience, add the 'store' property of every vue as a module in the main store
function initStore (store) {
  store.namespaced = true
  stores.modules[store.namespace] = store
}

if (process.env.NODE_ENV === 'development') {
  // wrap the xhr library used to hit the dev server when on local
  const methods = ['post', 'put', 'patch', 'head', 'del', 'get']

  methods.forEach(function (method) {
    xhr[method] = (function (func) {
      return function (config, cb) {
        if (config.url[0] === '/') {
          config.url = `http://localhost:3000${config.url}`
        }
        return func(config, cb)
      }
    }(xhr[method]))
  })
}
