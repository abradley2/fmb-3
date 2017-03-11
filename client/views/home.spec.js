const {createVue} = require('../lib/vue-test-utils')
const test = require('tape')

test('home view renders a button', function (t) {
  t.plan(2)

  const {render, select} = createVue(require('./home.vue'))

  render(function (err, rendered) {
    t.error(err)
    const results = select(rendered, 'children[**][*id=click-me]')
    t.ok(results[0])
  })
})

test('home view can change message', function (t) {
  t.plan(2)

  const {render, select, vue} = createVue(require('./home.vue'))

  vue.$store.commit('home/getMessage', 'New Message')

  render(function (err, rendered) {
    t.error(err)
    const results = select(rendered, 'children[**][content=New Message]')
    t.ok(results[0])
  })
})
