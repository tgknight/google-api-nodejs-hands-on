'use strict'

const google = require('googleapis')
const async = require('async')
const extend = require('lodash').extend
const mime = require('mime-types')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const Auth = require('../common/auth')
const promisifier = require('../util').promisifier

/**
 * Wrapper for Google Cloud Storage file
 *
 * @constructor
 * @alias {module:storage/file}
 *
 * @param {object} config - Configuration options
 * @param {string} config.bucketName - Name of the bucket
 * @param {string} config.keyFilename - Full path to the JSON key
 * @param {string} config.remotePath - The path to a storage/file object in the bucket
 */
class File {
  constructor (config) {
    this.config = config
    this.auth = new Auth()
    this.storage = google.storage('v1')
    Promise.promisifyAll(this.storage.objects, { promisifier })
  }

  /**
   * Upload a file to the bucket
   *
   * @param {string} localPath - The path to the file that will be uploaded
   * @return {Promise} promise - Either resolves to storage/file, or rejects an error
   */
  upload (localPath) {
    const params = {
      bucket: this.config.bucketName,
      resource: {
        name: encodeURIComponent(this.config.remotePath),
      },
      media: {
        mimeType: mime.lookup(localPath),
        body: fs.createReadStream(localPath),
      },
    }

    return new Promise((resolve, reject) => {
      this.auth.authenticate()
        .then(auth => this.storage.objects.insertAsync(extend(params, { auth })))
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  /**
   * Download a file from the bucket
   *
   * @param {string=} localPath - The path to a location that the file will be saved
   * @return {Promise} promise - Either resolves to the file's content / undefined,
   *     or rejects an error
   */
  download (localPath) {
    const params = {
      bucket: this.config.bucketName,
      object: encodeURIComponent(this.config.remotePath) + '?alt=media',
    }

    return new Promise((resolve, reject) => {
      this.auth.authenticate()
        .then(auth => this.storage.objects.getAsync(extend(params, { auth })))
        .then(content =>
          resolve(localPath ? fs.writeFileAsync(localPath, content, 'utf8') : content)
        )
        .catch(err => reject(err))
    })
  }

  /**
   * Delete a file on the bucket
   *
   * @return {Promise} promise - Either resolves, or rejects an error
   */
  delete () {
    const params = {
      bucket: this.config.bucketName,
      object: encodeURIComponent(this.config.remotePath),
    }

    return new Promise((resolve, reject) => {
      this.auth.authenticate()
        .then(auth => this.storage.objects.deleteAsync(extend(params, { auth })))
        .then(() => resolve())
        .catch(err => reject(err))
    })
  }

  /**
   * Retrieve metadata of the files
   *
   * @return {Promise} promise - Either resolves to objects resource, or rejects an error
   */
  metadata() {
    const params = {
      bucket: this.config.bucketName,
      object: encodeURIComponent(this.config.remotePath),
    }

    return new Promise((resolve, reject) => {
      this.auth.authenticate()
        .then(auth => this.storage.objects.getAsync(extend(params, { auth })))
        .then(metadata => resolve(metadata))
        .catch(err => reject(err))
    })
  }

  /**
   * Combine multiple files into one new file
   *
   * @param {string[]} components - List of files to be combined
   * @return {Promise} promise - Either resolves to storage/file of the new file,
   *     or rejects an error
   */
  combine(components) {
    const params = {
      destinationBucket: this.config.bucketName,
      destinationObject: encodeURIComponent(this.config.remotePath),
      resource: {
        kind: 'storage#composeRequest',
        sourceObjects: components.map(component => ({
          name: component,
        })),
        destination: {
          name: this.config.remotePath,
        },
      },
    }

    return new Promise((resolve, reject) => {
      this.auth.authenticate()
        .then(auth => this.storage.objects.composeAsync(extend(params, { auth })))
        .then((res) => resolve(res))
        .catch(err => reject(err))
    })
  }

  /**
   * Create a folder object in the bucket
   *
   * @return {Promise} promise - Either resolves to storage/file of the new folder,
   *     or rejects an error
   */
  createFolder () {
    const params = {
      bucket: this.config.bucketName,
      resource: {
        name: this.config.remotePath, // need to retain '/' to identify this as a folder object
      },
      media: {
        mimeType: 'text/plain',
        body: fs.createReadStream(__dirname + '/zerobyte'),
      },
    }

    return new Promise((resolve, reject) => {
      if (this.config.remotePath.lastIndexOf('/') !== this.config.remotePath.length - 1) {
        return reject(err)
      }

      this.auth.authenticate()
        .then(auth => this.storage.objects.insertAsync(extend(params, { auth })))
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  /**
   * Delete a folder object in the bucket
   *
   * @return {Promise} promise - Either resolves, or rejects an error
   */
  deleteFolder () {
    const params = {
      bucket: this.config.bucketName,
      object: encodeURIComponent(this.config.remotePath),
      prefix: this.config.remotePath,
    }

    const deleteFiles = files => {
      new Promise((resolve, reject) => {
        async.each(files, (f, cb) => {

          // 'new Promise' slows down operation, thus good ol' async
          this.storage.objects.delete(
            extend(params, { object: encodeURIComponent(f) }),
            (err, res) => !err ? cb() : cb(err)
          )
        }, err => !err ? resolve() : reject(err))
      })
    }

    return new Promise((resolve, reject) => {
      this.auth.authenticate()
        .then(auth => this.storage.objects.getAsync(extend(params, { auth })))
        .then(res => this.storage.objects.listAsync(params))

        // delete everything with the folder name prefix - including the folder itself
        .then(res => res.items.length ?
          deleteFiles(res.items.map(item => item.name)) :
          true
        )
        .then(() => resolve())
        .catch(err => reject(err))
    })
  }
}

module.exports = File
