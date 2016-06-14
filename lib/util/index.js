'use strict'

// put any utilty functions here as static methods
class Util {

  // custom promisifier for bluebird
  static promisifier (originalMethod) {
    const Promise = require('bluebird')
    return function promisified() {
      let args = [].slice.call(arguments)
      let _this = this
      return new Promise((resolve, reject) => {
        args.push(resolve, reject)
        originalMethod.apply(_this, args)
      })
    }
  }
}

module.exports = new Util
