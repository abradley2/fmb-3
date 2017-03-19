const equals = require('deep-equal')

module.exports = function (name, version) {
  var db
  var resolveCreate
  var rejectCreate

  if (typeof name !== 'string' || typeof version !== 'number') {
    throw new Error('Please provide name (string) and version number (integer)')
  }

  const openRequest = window.indexedDB.open(name, parseInt(version, 10))

  const createPromise = new Promise(function (resolve, reject) {
    resolveCreate = resolve
    rejectCreate = reject
  })

  openRequest.onerror = rejectCreate

  openRequest.onupgradeneeded = function (e) {
    db = e.target.result

    for (var i = 0; i < db.objectStoreNames.length; i++) {
      db.deleteObjectStore(db.objectStoreNames[i])
    }

    function checkReady () {
      if (
        db.objectStoreNames.contains('prev') &&
        db.objectStoreNames.contains('stored')
      ) {
        resolveCreate(storeTransaction(db))
      }
    }

    const stored = db.createObjectStore('stored', {keyPath: '__namespace__'})
    stored.createIndex('state', 'state', {unique: false})
    stored.transaction.oncomplete = checkReady
    stored.transaction.onerror = rejectCreate

    const prev = db.createObjectStore('prev', {keyPath: '__namespace__'})
    prev.createIndex('state', 'state', {unique: false})
    prev.transaction.oncomplete = checkReady
    prev.transaction.onerror = rejectCreate
  }

  openRequest.onsuccess = function (e) {
    db = e.target.result
    resolveCreate(storeTransaction(db))
  }

  return function recordState (namespace, store) {
    if (typeof namespace !== 'string') return recordState('root', namespace)

    if (namespace === 'root') {
      const deferreds = Object.keys(store.modules).map(function (ns) {
        return recordState(ns, store.modules[ns])
      })

      return Promise.all(deferreds)
    }

    // create a dedicated writer for the store, that has a bottleneck
    // so we aren't firing off a bunch of rapid writes all overwriting
    // eachother anyway
    const writer = bottleneck(function (state) {
      createPromise.then(function (handler) {
        handler('stored', 'put', state)
      })
    }, 500)

    if (!store.mutations) store.mutations = {}
    if (!store.state) store.state = {}

    store.state.__namespace__ = namespace

    // wrap store mutations to be setters
    for (var methodName in store.mutations) {
      store.mutations[methodName] = (function (mutation) {
        return function (state, payload) {
          // apply the mutation
          mutation(state, payload)
          // invoke the writer
          writer(state)
        }
      })(store.mutations[methodName])
    }

    store.mutations.__reloadState__ = function (state, newState) {
      for (var key in newState) {
        state[key] = newState[key]
      }
    }

    createPromise
      .then(function (handler) {
        // grab the data that was previously set
        return handler('prev', 'get', namespace)
          .then(function (prev) {
            return {handler, prev}
          })
      })
      .then(function ({handler, prev}) {
        // if there is no previously set data, make it the store's initial state
        if (typeof prev === 'undefined') {
          return handler('prev', 'put', store.state)
            .then(function () {
              return {handler, prev: store.state}
            })
        }
        return {handler, prev}
      })
      .then(function ({handler, prev}) {
        return handler('stored', 'get', namespace)
          .then(function (data) {
            return {handler, prev, stored: data}
          })
      })
      .then(function ({handler, prev, stored}) {
        // unless the store's default state has changed, load the stored state
        if (equals(prev, store.state)) {
          store.mutations.__reloadState__(store.state, stored)
          return Promise.resolve()
        } else {
          return handler('prev', 'put', store.state)
        }
      })
      .catch(function (err) {
        console.error(err)
      })
  }
}

// simple and easy to use promise wrappers for the
// indexedDB transactions done above
function storeTransaction (db, objectStore, transactionType, ...args) {
  if (arguments.length === 1) return storeTransaction.bind({}, db)

  const access = transactionType === 'get' ? 'readonly' : 'readwrite'
  const transaction = db.transaction([objectStore], access)

  const request = transaction.objectStore(objectStore)[transactionType](...args)

  return new Promise(function (resolve, reject) {
    request.onerror = function (err) {
      reject(err)
    }

    request.onsuccess = function (e) {
      resolve(e.target.result)
    }
  })
}

// utility function used to bottleneck writes after store mutations
function bottleneck (func, time) {
  var lastArgs = []
  var pending = false
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
