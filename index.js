'use strict'

const Google = require('./lib')
const google = new Google({
  projectId: 'siwat-project',
  clientConfig: {
    CLIENT_ID: '631579447125-55r9la6smdab5bc19ekhkrmcjplom5ak.apps.googleusercontent.com',
    CLIENT_SECRET: 'rTS_9_ZM2nGAQkZwWyA780Bq',
    REDIRECT_URL: 'http://localhost/oauth2callback',
  },
  credentials: {
    access_token: 'ya29.Ci8JAxnBtwCOTN1ZZhJ1h3KzGEYKlC6AD4qA-hxravCypGiES1UJA9d_36RggZCNsg',
    refrest_token: '1/nEFTBbMFOUCdkz6T51GS9UILOgVs_5uMVKmM9GlDPyQ',
  },

  // keyFilename: '/api_key/siwat-project-4b39dd4cc219.json',
})
/* const bucket = google.storage({
  location: 'asia-east1',
}).bucket('datana-dev') */

const cluster = google.dataproc().cluster({
  bucket: 'datana-dev',
  clusterName: 'datana-cluster-apis',
})

cluster.create({
  zone: 'asia-east1',
  masterType: 'n1-standard-4',
  workerType: 'n1-standard-4',
  workerNodeNumber: 2,
}).then(res => console.log(res)).catch(err => console.log(err))
/* const file = bucket.file('userdata/test.txt')
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

/* const deleted = google.storage({
  location: 'asia-east1',
}).bucket('tobedeleted')
deleted.delete().then(res => console.log(res)).catch(err => console.log(err)) */

// const file = bucket.file('testcombine/test.txt')

// file.metadata().then(res => console.log(res)).catch(err => console.log(err))
/* file.combine([
  'testcombine/sources/test.raw',
  'testcombine/sources/test.raw2',
]).then(res => console.log(res)).catch(err => console.log(err)) */

// file.upload('.jscsrc').then(res => console.log(res)).catch(err => console.log(err))

// const folder = bucket.file('newfolderja/')
// folder.deleteFolder().then(res => console.log(res)).catch(err => console.log(err))

/* folder.createFolder().then(res => {
  console.log(res)
  return setTimeout(() => folder.deleteFolder(), 10000)
}).then(res => console.log(res)) */

/* const newFile = bucket.file('newfile.txt')
newFile.upload('LICENSE').then(res => console.log(res)).catch(err => console.log(err)) */
