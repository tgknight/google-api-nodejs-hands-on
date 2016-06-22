'use strict'

const google = require('googleapis')
const Promise = require('bluebird')
const promisifier = require('../util')

class Auth {
  // below is for default authorization provided by cloud SDK or
  // Compute Engine
  constructor() {
    Promise.promisifyAll(google.auth, { promisifier })
  }

  authenticate() {
    return google.auth.getApplicationDefaultAsync()
  }

  // below is for OAuth2 credentials
  /* constructor(clientConfig, credentials) {
    this.oauth2Client = new google.auth.OAuth2(
      clientConfig.CLIENT_ID,
      clientConfig.CLIENT_SECRET,
      clientConfig.REDIRECT_URL
    )
    this.credentials = credentials
    google.options({ auth: this.oauth2Client })
  }

  authenticate() {
    this.oauth2Client.setCredentials(this.credentials)
    google.options({ auth: this.oauth2Client })
  } */

  // below is for JWT keyfile
  /* constructor(keyPath) {
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
        .catch(err => reject(err))
    })
  } */
}

module.exports = Auth
