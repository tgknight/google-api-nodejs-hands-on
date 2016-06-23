'use strict'

const google = require('googleapis')
const Promise = require('bluebird')
const promisifier = require('../util')

/**
 * Wrapper for Google Cloud Authentication
 * Currently supports only Cloud SDK or Compute Engine default authorization
 *
 * @constructor
 * @alias {module:auth}
 *
 * TODO: Add support to OAuth2 and JWT
 */
class Auth {
  constructor() {
    Promise.promisifyAll(google.auth, { promisifier })
  }

  authenticate() {
    return google.auth.getApplicationDefaultAsync()
  }
}

module.exports = Auth
