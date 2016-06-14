'use strict'

const google = require('googleapis')
const Promise = require('bluebird')
const extend = require('lodash').extend
const merge = require('lodash').merge
const async = require('async')
const File = require('./file')
const Auth = require('../common/auth')
const promisifier = require('../util').promisifier

class Bucket {
  constructor(config) {
    this.config = config
    this.auth = new Auth(this.config.keyFilename)
    this.auth.authenticate()
    this.storage = google.storage('v1')
    Promise.promisifyAll(this.storage.buckets, { promisifier })
    Promise.promisifyAll(this.storage.objects, { promisifier })
  }

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

  delete() {
    const params = {
      auth: this.auth.authClient,
      bucket: this.config.bucketName,
    }

    // 'new Promise' slows down operations, thus good old async
    const deleteFiles = files => {
      console.log('called')
      new Promise((resolve, reject) => {
        async.each(files, (f, cb) => {
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

  file(remotePath) {
    return new File(merge(this.config, { remotePath }))
  }
}

module.exports = Bucket
