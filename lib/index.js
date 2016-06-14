'use strict'

const extend = require('lodash').extend
const apis = {
  compute: require('./compute'),
  dataproc: require('./dataproc'),
  storage: require('./storage'),
}

class Google {
  constructor(config) {
    this.config = config
  }

  compute(config) {
    return new apis.compute(extend(this.config, config))
  }

  dataproc(config) {
    return new apis.dataproc(extend(this.config, config))
  }

  storage(config) {
    return new apis.storage(extend(this.config, config))
  }
}

module.exports = Google
