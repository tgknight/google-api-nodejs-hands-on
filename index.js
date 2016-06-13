'use strict'

/* const GCS = require('./storage')
const gcs = new GCS('datana-dev', '/api_key/key.json')
const file = gcs.file('userdata/test.txt')

file.download()
  .then((content) => {
    console.log(content)
  }) */

/* const Auth = require('./lib/common/auth')
const auth = new Auth('/api_key/key.json')

auth.authenticate()
  .then(tokens => {
    console.log(tokens)
  })
*/

/* const Google = require('./lib')
const google = new Google('/api_key/key.json')
const storage = google.storage({
  bucketName: 'datana-dev',
})

console.log(storage) */

const Google = require('./lib')
const google = new Google('/api_key/key.json')
const file = google.storage({
  bucketName: 'datana-dev',
}).file('userdata/test.txt')

file.download()
  .then(res => console.log(res))
