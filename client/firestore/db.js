//import firebase from 'firebase'
const firebase = require('firebase/app')
require('firebase/firestore')
require('firebase/auth')

console.log('NOTE: current environment [', process.env.NODE_ENV, ']')

const app = firebase.initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID
})

module.exports = {
  app,
  auth: firebase.auth(),
  db: firebase.firestore(),
  firestore: firebase.firestore,
  provider: new firebase.auth.GoogleAuthProvider()
}
