module.exports = function (name, version) {
  let db
  let resolveCreate

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
    const objectStore = db.createObjectStore('store', {keyPath: 'namespace'})
    objectStore.createIndex('prev', 'prev', {unique: false})
    objectStore.createIndex('state', 'state', {unique: false})
    objectStore.transaction.oncomplete = function () {
      resolveCreate()
    }
  }

  openRequest.onsuccess = function (e) {
    db = e.target.result
    resolveCreate()
  }

  return function recordState (namespace, store) {
    if (!namespace) return recordState('root', namespace)

    if (namespace === 'root') {
      Object.keys(store.modules).forEach(function (ns) {
        recordState(ns, store)
      })
    }

    createPromise
      .then(function () {
        return {handler: storeTransaction(db)}
      })
      .then(function ({handler}) {
        // grab the data that was previously set
        return handler('get', namespace)
          .then(function (data) {
            return {handler, data}
          })
      })
      .then(function ({handler, data}) {
        // if initialState has changed, return initial state
        // otherwise re-saturate store with saved state
        console.log('data = ', data)
      })
  }
}

function storeTransaction (db, transactionType, ...args) {
  if (arguments.length === 1) return storeTransaction.bind({}, db)

  const access = transactionType === 'get' ? 'read' : 'readwrite'
  const transaction = db.transaction(['store'], access)

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
