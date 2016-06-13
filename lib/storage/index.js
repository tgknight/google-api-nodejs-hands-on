'use strict'

const Bucket = require('./bucket')
const merge = require('lodash').merge

class Storage {
  constructor (config) {
    this.config = config
  }

  bucket (bucketName) {
    return new Bucket(merge(this.config, { bucketName }))
  }
}

module.exports = Storage
