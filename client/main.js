const Vue = require('vue')
const Vuex = require('vuex')
const Router = require('vue-router')
const xhr = require('xhr')
const app = require('./app.vue')
const persist = require('./lib/vue-local-persist')
const {omit} = require('./utils')

window.Promise = require('es6-promise').Promise

const routes = []
const storeConfig = {
  plugins: [],
  actions: {route: handleRoute},
  state: {},
  modules: {}
}

Vue.use(Router)
Vue.use(Vuex)

// initialize all view modules
initModule('home', ['/', '/home'], require('./views/home.vue'))
initModule('login', ['/login'], require('./views/login.vue'))
initModule('register', ['/register'], require('./views/register.vue'))
initModule('profile', ['/profile'], require('./views/profile.vue'))

// initialize all components
initComponent('v-navbar', require('./components/navbar.vue'))
initComponent('v-modal', require('./components/modal.vue'))
initComponent('v-error-modal', require('./components/error-modal.vue'))
initComponent('v-button', require('./components/button.vue'))

// initialize all stores
initStore('env', require('./stores/env'))
initStore('user', require('./stores/user'))
initStore('location', require('./stores/location'))
initStore('modal', require('./stores/modal'))

// Add development plugins if in dev
if (process.env.NODE_ENV === 'development') {
  const createLogger = require('vuex/dist/logger')
  storeConfig.plugins.push(createLogger())
  persist('MyVueApp', 10)(storeConfig)
}

// App start
const store = new Vuex.Store(storeConfig)
const router = new Router({routes})

router.afterEach(function (to, from) {
  store.commit('location/setRoute', {to, from})
})

new Vue({
  router,
  store,
  render: function (createElement) {
    return createElement(app)
  }
}).$mount('#app')

function handleRoute (ctx, params) {
  router.push(params)
}

// function to init a module and have it's routes/stores/component added to the app
function initModule (namespace, paths, config) {
  const view = initView(namespace, config)
  initRoute(paths, view)
  if (config.store) initStore(namespace, config.store)
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
function initStore (namespace, store) {
  store.namespaced = true
  storeConfig.modules[namespace] = store
}

function initComponent (name, config) {
  if (config.store) initStore(name, config.store)
  Vue.component(name, omit(config, 'store'))
}

if (process.env.NODE_ENV === 'development') {
  // wrap the xhr library used to hit the dev server when on local.
  // I find this simpler than always having to proxy.
  // Also enforces that the xhr.method pattern is always used
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
