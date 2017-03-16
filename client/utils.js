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
