'use strict'

const google = require('googleapis')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const Auth = require('../common/auth')
const promisifier = require('../util').promisifier

class File {
  constructor (config) {
    this.config = config
    this.auth = new Auth(config.keyFilename)
    this.auth.authenticate()
    this.storage = google.storage('v1')
    Promise.promisifyAll(this.storage.objects, { promisifier })
  }

  // upload (localPath) {}

  download (localPath) {
    const params = {
      auth: this.auth.authClient,
      bucket: this.config.bucketName,
      object: encodeURIComponent(this.config.remotePath) + '?alt=media',
    }

    return new Promise((resolve, reject) => {
      this.storage.objects.getAsync(params)
        .then(content =>
          resolve(localPath ? fs.writeFileAsync(localPath, content, 'utf8') : content)
        )
        .catch(err => reject(err))
    })
  }

  delete () {
    const params = {
      auth: this.auth.authClient,
      bucket: this.config.bucketName,
      object: encodeURIComponent(this.config.remotePath),
    }

    return new Promise((resolve, reject) => {
      this.storage.objects.deleteAsync(params)
        .then(() => resolve())
        .catch(err => reject(err))
    })
  }

  // createFolder () {}

  // deleteFolder () {}
}

module.exports = File
