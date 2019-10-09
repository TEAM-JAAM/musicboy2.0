//import firebase from 'firebase'
const firebase = require('firebase/app')
require('firebase/firestore')
require('firebase/auth')

const jaam = require('../secrets')

const app = firebase.initializeApp({
  apiKey: jaam.API_KEY,
  authDomain: jaam.AUTH_DOMAIN,
  projectId: jaam.PROJECT_ID
})

module.exports = {
  app,
  auth: firebase.auth(),
  db: firebase.firestore(),
  firestore: firebase.firestore,
  provider: new firebase.auth.GoogleAuthProvider()
}
