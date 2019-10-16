const {db} = require('../db')
const util = require('../utils/dbUtils')

//
// --[ User ]--------------------------------------------------------------
//
// This class, when instantiated, represents the Firestore document
// associated with a single user.
//
class User {
  constructor(userDocRef) {
    this.userDocRef = userDocRef
  }

  // Static methods.........................................................
  // Find a user by their user id (auth.currentUser.uid)
  // Mandatory fields: uid
  static async findOne(objectData) {
    const mandatoryFields = ['email']
    if (!util.allMandatoryFieldsProvided(objectData, mandatoryFields)) {
      throw new util.MissingMandatoryFieldError(mandatoryFields)
    }
    const userCollectionRef = db.collection('users')
    const users = await userCollectionRef
      .where('email', '==', objectData.email)
      .get()
    if (!users.empty) {
      console.log('NOTE: user exists')
      const userDocRef = users.docs[0].ref
      userDocRef.update(objectData)
      return new User(userDocRef)
    } else {
      return null
    }
  }

  static fromDocRef(userDocRef) {
    return new User(userDocRef)
  }

  static docRefFromUid(uid) {
    return uid && db.collection('users').doc(uid)
  }

  // Instance methods......................................................
  ref() {
    return this.userDocRef
  }
}

module.exports = User
