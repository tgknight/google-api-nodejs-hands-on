'use strict'

const google = require('googleapis')
const Promise = require('bluebird')
const extend = require('lodash').extend
const merge = require('lodash').merge
const async = require('async')
const File = require('./file')
const Auth = require('../common/auth')
const promisifier = require('../util').promisifier

/**
 * Wrapper for Google Cloud Storage bucket
 *
 * @constructor
 * @alias {module:storage/bucket}
 *
 * @param {object} config - Configuration operations
 * @param {string} config.bucketName - Name of the bucket
 * @param {string} config.keyFilename - Full path to the JSON key
 */
class Bucket {
  constructor(config) {
    this.config = config
    this.auth = new Auth(this.config.keyFilename)
    this.auth.authenticate()
    this.storage = google.storage('v1')
    Promise.promisifyAll(this.storage.buckets, { promisifier })
    Promise.promisifyAll(this.storage.objects, { promisifier })
  }

  /**
   * Create a bucket
   *
   * @return {Promise} promise - Either resolves to storage/bucket, or rejects an error
   */
  create() {
    const params = {
      auth: this.auth.authClient,
      project: this.config.projectId,
      resource: {
        name: this.config.bucketName,
        location: this.config.location,
      },
    }

    return new Promise((resolve, reject) => {
      this.storage.buckets.insertAsync(params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  /**
   * Get a storage/bucket reference
   *
   * @return {Promise} promise - Either resolves to storage/bucket, or rejects an error
   */
  get() {
    const params = {
      auth: this.auth.authClient,
      bucket: this.config.bucketName,
    }

    return new Promise((resolve, reject) => {
      this.storage.buckets.getAsync(params)
        .then(bucket => resolve(bucket))
        .catch(err => reject(err))
    })
  }

  /**
   * Delete a bucket, along with all files belonging to the bucket
   *
   * @return {Promise} promise - Either resolves, or rejects an error
   */
  delete() {
    const params = {
      auth: this.auth.authClient,
      bucket: this.config.bucketName,
    }

    const deleteFiles = files => {
      new Promise((resolve, reject) => {
        async.each(files, (f, cb) => {

          // 'new Promise' slows down operation, thus good ol' async
          this.storage.objects.delete(
            extend(params, { object: encodeURIComponent(f) }),
            (err, res) => !err ? cb() : cb(err)
          )
        }, err => err ? resolve() : reject(err))
      })
    }

    return new Promise((resolve, reject) => {
      this.get()
        .then(() => this.list())

        // must delete files in bucket first
        .then(res => res.items.length ?
          deleteFiles(res.items.map(item => item.name)) :
          true
        )
        .then(() => this.storage.buckets.deleteAsync(params))
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  /**
   * Return a list of all storage/file objects belonging to the bucket
   *
   * @param {string=} prefix - Filter results to objects whose name begin with this prefix
   */
  list(prefix) {
    const params = {
      auth: this.auth.authClient,
      bucket: this.config.bucketName,
    }
    if (prefix) params.prefix = prefix

    return new Promise((resolve, reject) => {
      this.storage.objects.listAsync(params)
        .then(files => resolve(files))
        .catch(err => reject(err))
    })
  }

  /**
   * Create a file wrapper. See {module:storage/file} for more details
   *
   * @param {string} remotePath - The path to storage/file object in this bucket
   * @return {module:storage/file}
   */
  file(remotePath) {
    return new File(merge(this.config, { remotePath }))
  }
}

module.exports = Bucket
