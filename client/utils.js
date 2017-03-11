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
