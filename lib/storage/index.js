'use strict'

const Bucket = require('./bucket')
const merge = require('lodash').merge

/**
 * Entry point for accessing Google Cloud Storage buckets
 *
 * @constructor
 * @alias {module:storage}
 *
 * @param {object} config - Configuration options
 * @param {string} config.keyFilename - Full path to the JSON key
 */
class Storage {
  constructor (config) {
    this.config = config
  }

  /**
   * Create a bucket wrapper. See {module:storage/bucket} for more details
   *
   * @param {string} bucketName - Name of the bucket
   * @return {module:storage/bucket}
   */
  bucket (bucketName) {
    return new Bucket(merge(this.config, { bucketName }))
  }
}

module.exports = Storage
