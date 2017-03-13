const {createVue} = require('../lib/vue-test-utils')
const test = require('tape')

const sut = require('./home.vue')

sut.components = {
  'v-navbar': require('../components/navbar')
}

const stores = {
  home: sut.store,
  user: require('../stores/user')
}

test('home view renders a button', function (t) {
  t.plan(2)

  const {render, select} = createVue(sut, stores)

  render(function (err, rendered) {
    t.error(err)
    const result = select(rendered, '$..[?(@.id=="click-me")]')
    t.ok(result)
  })
})

test('home view can change message', function (t) {
  t.plan(2)

  const {render, select, vue} = createVue(sut, stores)

  vue.$store.commit('home/getMessage', 'New Message')

  render(function (err, rendered) {
    t.error(err)
    const result = select(rendered, '$..[?(@.contents.includes("New Message"))]')
    t.ok(result)
  })
})
