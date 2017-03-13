require('vuegister').register()
const hyperx = require('hyperx')
const jp = require('jsonpath')
const {omit} = require('../utils')
const h = hyperx(toJS)

exports.createVue = function (sut, modules = {}) {
  const renderer = require('vue-server-renderer').createRenderer()
  const Vue = require('vue')
  const Vuex = require('vuex')

  Vue.use(Vuex)

  // all views have a computed "state" function that is a computed to their
  //  own store need to replicate this
  Object.keys(modules).forEach(function (ns) {
    if (modules[ns] === sut.store) {
      sut.computed = sut.computed || {}
      sut.computed.state = function () {
        return this.$store.state[ns]
      }
    }
  })

  const storeConfig = {
    modules,
    state: {}
  }

  const store = new Vuex.Store(storeConfig)

  const vueConfig = Object.assign({}, omit(sut, 'store'), {store})
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

// function to use with hyperx to turn html string into JSON tree
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
