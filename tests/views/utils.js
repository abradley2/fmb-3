require('vuegister').register()
const renderer = require('vue-server-renderer').createRenderer()

exports.createVue = function (sut, storeModules) {
  const Vue = require('vue')
  const Vuex = require('vuex')

  Vue.use(Vuex)

  const namespace = sut.store.namespace
  const store = new Vuex.Store(createStoreConfig(sut, storeModules || []))

  sut.computed = sut.computed || {}
  sut.computed.state = function () {
    // console.log('computed called!', namespace, this.$store.state)
    return this.$store.state[namespace]
  }

  const vue = new Vue(
    Object.assign(sut, {store})
  )

  return {
    vue,
    store: vue.$store,
    renderToString: function (cb) {
      renderer.renderToString(vue, cb)
    }
  }
}

// create a store using the mocks provided.
// then calls "add module to store"
function createStoreConfig (view, modules) {
  const store = {
    modules: {},
    state: {}
  }
  addModuleToStore(store, view.store)
  modules.forEach(function (mod) {
    addModuleToStore(store, mod)
  })
  return store
}

function addModuleToStore (store, modStore) {
  Object.assign(store.modules, createStoreModule(modStore))
}

function createStoreModule (modStore) {
  return {
    [modStore.namespace]: {
      namespaced: true,
      state: modStore.state || {},
      actions: modStore.actions || {},
      mutations: modStore.mutations || {}
    }
  }
}
