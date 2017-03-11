const {createVue} = require('./utils')
const test = require('tape')

test('home view works', function (t) {
  t.plan(3)

  const home = require('../../client/views/home.vue')

  const {vue, renderToString} = createVue(home)

  console.log(vue)

  renderToString(function (err, html) {
    console.log(err, html)
    t.error(err)
    t.ok(html)
  })

  t.equal(3, 1 + 2)
})
