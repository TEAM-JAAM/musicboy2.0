//import firebase from 'firebase'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

firebase.initializeApp({
  apiKey: 'AIzaSyCO0SDZOwfPyhhMPn7qqFrxcUF0T-wkTh8',
  authDomain: 'jaam-f380f.firebaseapp.com',
  projectId: 'jaam-f380f'
})

export const db = firebase.firestore()
export const auth = firebase.auth()
export const provider = new firebase.auth.GoogleAuthProvider()

const initDb = async () => {
  try {
    await db
      .collection('projects')
      .doc('big-bang')
      .set({
        name: 'first-jaam-project',
        count: 1
      })

    await db
      .collection('users')
      .doc('cody')
      .set({
        email: 'cody@email.com',
        password: 123456
      })
    console.log('NOTE: successfully updated first jaam')
  } catch (error) {
    console.error('FATAL: failed to populate initial project')
  }
}

initDb()
