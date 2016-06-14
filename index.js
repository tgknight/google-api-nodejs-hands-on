'use strict'

const Google = require('./lib')
const google = new Google({
  projectId: 'siwat-project',
  keyFilename: '/api_key/key.json',
})
/* const bucket = google.storage({
  location: 'asia-east1',
}).bucket('datana-dev')
const file = bucket.file('userdata/test.txt')
const file2 = bucket.file('userdata/README.md')

// bucket.get().then(res => console.log(res))

file.download().then(res => console.log(res))
file2.download().then(res => console.log(res))

/* const newBucket = google.storage({
  location: 'asia-east1',
}).bucket('new-datana-bucket-tmp')

newBucket.create()
  .then(res => console.log(res))
  .catch(err => console.log(err))
*/

const deleted = google.storage({
  location: 'asia-east1',
}).bucket('tobedeleted')
deleted.delete().then(res => console.log(res)).catch(err => console.log(err))
