'use strict'

const extend = require('lodash').extend
const apis = {
  compute: require('./compute'),
  dataproc: require('./dataproc'),
  storage: require('./storage'),
}

class Google {
  constructor(keyFilename) {
    this.conf = { keyFilename }
  }

  compute(config) {
    return new apis.compute(extend(config, this.conf))
  }

  dataproc(config) {
    return new apis.dataproc(extend(config, this.conf))
  }

  storage(config) {
    return new apis.storage(extend(config, this.conf))
  }
}

module.exports = Google
