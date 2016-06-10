'use strict'

const google = require('googleapis')
const storage = google.storage('v1')

const key = require('./key.json')
const authClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/cloud-platform'],
  null
)

authClient.authorize((err, tokens) => {
  if (err) {
    console.log('auth error', err)
    return
  }

  storage.objects.get({
    auth: authClient,
    bucket: 'datana-dev',
    object: encodeURIComponent('userdata/test.txt') + '?alt=media'
  }, (err, res) => {
    if (err) {
      console.log('get error', err)
      return
    }
    console.log(res)
  })
  /* storage.objects.list({
    auth: authClient,
    bucket: 'datana-dev',
    prefix: 'userdata/users.csv'
  }, (err, res) => {
    if (err) {
      return console.log('list error', err)
    }
    console.log(res)
  }) */
})
