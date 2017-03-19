const equals = require('deep-equal')

module.exports = function (name, version) {
  var db
  var resolveCreate

  if (typeof name !== 'string' || typeof version !== 'number') {
    throw new Error('Please provide name (string) and version number (integer)')
  }

  const openRequest = window.indexedDB.open(name, parseInt(version, 10))

  const createPromise = new Promise(function (resolve) {
    resolveCreate = resolve
  })

  openRequest.onerror = function (err) {
    console.error(err)
  }

  openRequest.onupgradeneeded = function (e) {
    db = e.target.result

    if (db.objectStoreNames.contains('store')) {
      db.deleteObjectStore('store')
    }

      // create the objectStore if needed
    const objectStore = db.createObjectStore('store', {keyPath: '__namespace__'})

    objectStore.createIndex('prev', 'prev', {unique: false})
    objectStore.createIndex('state', 'state', {unique: false})
    objectStore.transaction.oncomplete = function () {
      resolveCreate(storeTransaction(db))
    }
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
        handler('put', state)
      })
    }, 500)

    if (!store.mutations) store.mutations = {}
    if (!store.state) store.state = {}

    store.mutations.__reloadState__ = function (state, newState) {
      for (var key in newState) {
        state[key] = newState[key]
      }
    }

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

    createPromise
      .then(function (handler) {
        // grab the data that was previously set
        return handler('get', namespace)
          .then(function (data) {
            return {handler, data}
          })
      })
      .then(function ({handler, data}) {
        if (typeof data === 'undefined') {
          const initial = {state: {}, prev: store.state}
          return handler('put', initial)
            .then(function () {
              return {handler, data: initial}
            })
        }
        return {handler, data}
      })
      .then(function ({handler, data}) {
        // unless the store's default state has changed, load the stored state
        if (!equals(store.state, data.prev)) {
          store.mutations.__reloadState__(store.state, data.state)
        }
        return {handler, data}
      })
      .catch(function (err) {
        console.error(err)
      })
  }
}

// simple and easy to use promise wrappers for the
// indexedDB transactions done above
function storeTransaction (db, transactionType, ...args) {
  if (arguments.length === 1) return storeTransaction.bind({}, db)

  const access = transactionType === 'get' ? 'readonly' : 'readwrite'
  const transaction = db.transaction(['store'], access)

  console.log(transactionType, ...args)

  const request = transaction.objectStore('store')[transactionType](...args)

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
