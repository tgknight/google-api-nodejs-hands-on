'use strict'

const google = require('googleapis')
const Promise = require('bluebird')
const promisifier = require('../util')

class Auth {
  constructor(keyPath) {
    this.key = require(process.cwd() + keyPath)
    this.authClient = new google.auth.JWT(
      this.key.client_email,
      null,
      this.key.private_key,
      ['https://www.googleapis.com/auth/cloud-platform'],
      null
    )
    Promise.promisifyAll(this.authClient, { promisifier })
  }

  authenticate() {
    return new Promise((resolve, reject) => {
      this.authClient.authorizeAsync()
        .then(tokens => resolve(tokens))
        .catch(err => {
          console.log('auth error', err)
          return reject(err)
        })
    })
  }
}

module.exports = Auth
