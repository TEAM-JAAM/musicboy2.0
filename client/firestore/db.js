import firebase from 'firebase'
import 'firebase/firestore'

firebase.initializeApp({
  apiKey: 'AIzaSyCO0SDZOwfPyhhMPn7qqFrxcUF0T-wkTh8',
  authDomain: 'jaam-f380f.firebaseapp.com',
  projectId: 'jaam-f380f'
})

const db = firebase.firestore()

const initDb = async () => {
  try {
    await db
      .collection('projects')
      .doc('big-bang')
      .set({
        name: 'first-jaam-project',
        count: 1
      })
    console.log('NOTE: successfully updated first jaam')
  } catch (error) {
    console.error('FATAL: failed to populate initial project')
  }
}

initDb()
export default db
