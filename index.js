
var assert = require('assert')
var pathResult = require('lodash.result')

module.exports = {
  createStore,
  getStore,
  interpolate,
}

var REGEX = new RegExp('\{([a-z0-9_-]+):(.+?\)}', 'i')

var storeType = {}

function createStore(name, type) {
  storeType[name] = type
  return getStore(name)
}

function getStore(storeKey) {
  return gauge.dataStore[storeType[storeKey] || 'scenarioStore']
}

function escapeValue(value) {
  return String(value)
}

function interpolate(string) {
  var match = REGEX.exec(string)

  if (match) {
    var storeKey = match[1]
    var path = match[2]
    var store = getStore(storeKey)
    var data = store.get(storeKey)
    assert.ok(data, '"' + storeKey + '" store is empty')
    var value = pathResult(data, path, '')
    return string.slice(0, string.indexOf(match[0]))
      + escapeValue(value)
      + interpolate(string.slice(string.lastIndexOf(match[0]) + match[0].length))
  }

  return string
}
