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
    const mandatoryFields = ['uid']
    if (!util.allMandatoryFieldsProvided(objectData, mandatoryFields)) {
      throw new util.MissingMandatoryFieldError(mandatoryFields)
    }

    const userDocSnapshot = await db
      .collection('users')
      .doc(objectData.uid)
      .get()
    if (!userDocSnapshot.exists) {
      throw new util.UnknownUserError()
    }

    return new User(userDocSnapshot.ref)
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
