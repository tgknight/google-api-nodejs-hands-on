'use strict'

const google = require('googleapis')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const Auth = require('../common/auth')
const promisifier = require('../util')

class File {
  constructor (remotePath, storage) {
    const { bucketName, keyFilename } = storage
    this.bucketName = bucketName
    this.remotePath = remotePath
    this.auth = new Auth(keyFilename)
    this.storage = google.storage('v1')
    Promise.promisifyAll(this.storage.objects, { promisifier })
  }

  // upload (localPath) {}

  download (localPath) {
    const params = {
      auth: this.auth.authClient,
      bucket: this.bucketName,
      object: encodeURIComponent(this.remotePath) + '?alt=media',
    }

    return new Promise((resolve, reject) => {
      this.auth.authenticate()
        .then(tokens => this.storage.objects.getAsync(params))
        .then(content =>
          resolve(localPath ? fs.writeFileAsync(localPath, content, 'utf8') : content)
        )
        .catch(err => reject(err))
    })
  }

  // delete () {}

  // createFolder () {}

  // deleteFolder () {}
}

module.exports = File
