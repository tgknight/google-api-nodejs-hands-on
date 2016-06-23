'use strict'

module.exports = config => {
  const GoogleApis = require('./lib')
  return new GoogleApis(config)
}
