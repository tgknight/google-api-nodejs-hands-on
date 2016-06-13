'use strict'

// custom promisifier for bluebird
exports.promisifier = function (originalMethod) {
  return function promisified() {
    let args = [].slice.call(arguments)
    let _this = this
    return new Promise((resolve, reject) => {
      args.push(resolve, reject)
      originalMethod.apply(_this, args)
    })
  }
}
