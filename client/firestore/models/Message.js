const {db, firestore} = require('../db')

//
// --[ Message ]--------------------------------------------------------------
//
// This class, when instantiated, represents the Firestore document
// associated with a project's messages.
//
class Message {
  constructor(messageDocRef) {
    this.messageDocRef = messageDocRef
  }

  // Static methods...........................................................
  //
  static async create(parentProject) {
    const projectDocRef = parentProject.ref()
    const chatCollectionRef = projectDocRef.collection('chat')
    const defaults = {
      email: '',
      content: '',
      timestamp: firestore.Timestamp.now()
    }
    console.log('NOTE: creating new message...', defaults)
    const newMessageDocRef = await chatCollectionRef.add(defaults)

    return new Message(newMessageDocRef)
  }

  static fetchAllMessagesData(querySnapshot) {
    const messages = []
    querySnapshot &&
      querySnapshot.forEach(queryDocSnapshot => {
        const message = queryDocSnapshot.data()
        message.docRef = queryDocSnapshot.ref
        messages.push(message)
      })

    return messages
  }

  static async send(messageDocRef, objectData) {
    // Add the current timestamp value to the object data
    objectData.timestamp = firestore.Timestamp.now()

    await messageDocRef.update(objectData)
  }
}

module.exports = Message
