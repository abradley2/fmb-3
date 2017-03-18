const series = require('run-series')
const equals = require('deep-equal')

exports.omit = function (obj, keys) {
  if (typeof keys === 'string') return exports.omit(obj, [keys])
  return Object.keys(obj).reduce(function (acc, cur) {
    if (keys.indexOf(cur) === -1) acc[cur] = obj[cur]
    return acc
  }, {})
}

exports.pick = function (obj, keys) {
  if (typeof keys === 'string') return exports.pick(obj, [keys])
  return Object.keys(obj).reduce(function (acc, cur) {
    if (keys.indexOf(cur) !== -1) acc[cur] = obj[cur]
    return acc
  }, {})
}

exports.splitEvery = function (num, arr) {
  let i = 0
  let pairCount = 0
  let retVal = [[]]
  arr.forEach(item => {
    retVal[pairCount].push(item)
    i++
    if (i === num) {
      i = 0
      pairCount++
      retVal.push([])
    }
  })
  return retVal
}

exports.getArray = function (size, placeholderVal = null) {
  if (size <= 0 || typeof size !== 'number') {
    return []
  }
  let retVal = []
  let i = 1
  while (i <= size) {
    retVal.push(placeholderVal)
    i++
  }
  return retVal
}

exports.xtend = function (obj1, obj2) {
  for (let prop in obj2) {
    if (Object.hasOwnProperty.call(obj2, prop)) {
      obj1[prop] = obj2[prop]
    }
  }
  return obj1
}

exports.bottleneck = function (func, time) {
  let lastArgs = []
  let pending = false
  function debounced () {
    lastArgs = arguments
    if (pending) {
      clearTimeout(pending)
    }
    pending = setTimeout(function () {
      func.apply({}, lastArgs)
    }, time)
  }
  return debounced
}

exports.recordState = function (namespace, storeModule, db) {
  if (typeof namespace !== 'string') return exports.recordState('root', namespace)

  const name = `${window.location.hostname}:VuexState:stored:${namespace}`
  const initialName = `${window.location.hostname}:VuexState:initial:${namespace}`

  // we need a record of the store's initial state. So if the initial state
  // is changed, we don't try to reload the stored state
  const initialState = storeModule.state || {}

  db.setItem(initialName, JSON.stringify(initialState))

  for (let key in storeModule.mutations) {
    // wrap every mutation in the module
    storeModule.mutations[key] = (function (method) {
      // create a "writer" for each that is bottlenecked to reduce overhead
      const writer = exports.bottleneck(function (snapshot) {
        db.setItem(name, snapshot)
      }, 500)

      return function (state, payload) {
        // call the mutation on the store
        method(state, payload)
        // have the writer save the resulting state
        try {
          const newState = JSON.stringify(state)
          writer(newState)
        } catch (err) {
          console.error(state, err)
        }
      }
    })(storeModule.mutations[key])
  }

  if (!storeModule.mutations) storeModule.mutations = {}

  // add a mutation to the store that allows it to reload state
  storeModule.mutations.__reloadState__ = function (state, reloadedState) {
    exports.xtend(state, reloadedState)
  }

  series([
    // first load the initial state. If it has changed, do not
    // continue.
    function (next) {
      db.getItem(initialName, function (err, data) {
        if (err) return next(err)
        if (!equals(JSON.parse(data), initialState)) return next('Initial State Changed')
        return next()
      })
    },
    // load the stored state, and call the reloadState mutation
    function (next) {
      db.getItem(name, function (err, data) {
        if (err) return next(err)
        if (!data) return next('No Data')
        storeModule.mutations.__reloadState__(storeModule.state, JSON.parse(data))
        next()
      })
    }
  ])
}
