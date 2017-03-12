require('vuegister').register()
const hyperx = require('hyperx')
const jp = require('jsonpath')
const h = hyperx(toJS)

exports.createVue = function (sut, storeModules) {
  const renderer = require('vue-server-renderer').createRenderer()
  const Vue = require('vue')
  const Vuex = require('vuex')

  Vue.use(Vuex)

  const namespace = sut.store.namespace
  const storeConfig = createStoreConfig(sut, storeModules || [])
  const store = new Vuex.Store(storeConfig)

  sut.computed = sut.computed || {}
  sut.computed.state = function () {
    return this.$store.state[namespace]
  }

  const vueConfig = Object.assign({}, sut, {store})
  const vue = new Vue(vueConfig)

  function render (cb) {
    renderer.renderToString(vue, function (err, html) {
      if (err) return cb(err)
      const pojo = h([html])
      return cb(null, pojo)
    })
  }

  function select (pojo, selector) {
    if (!pojo) throw new Error('pojoDOM is not defined')
    return jp.query(pojo, selector)
  }

  return {
    vue,
    store: vue.$store,
    render,
    select
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
  modules.forEach(addModuleToStore.bind({}, store))
  return store
}

function addModuleToStore (store, modStore) {
  Object.assign(store.modules, {
    [modStore.namespace]: {
      namespaced: true,
      state: modStore.state || {},
      actions: modStore.actions || {},
      mutations: modStore.mutations || {}
    }
  })
}

function toJS (tag, attributes, children) {
  const retVal = {
    tag,
    attributes
  }
  if (children) {
    retVal.children = children.map(function (cn) {
      return (typeof cn === 'string') ? {contents: cn} : cn
    })
  }
  if (attributes.id) retVal.id = attributes.id
  if (attributes.className) retVal.class = attributes.className
  return retVal
}
