const {db, firestore} = require('../db')
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

  static async findAllProjects(userDocRef, query) {
    const userDocSnapshot = await userDocRef.get()
    if (!userDocSnapshot.exists) {
      throw new util.UnknownUserError()
    }

    return userDocSnapshot.data().projects
  }

  static fromDocRef(userDocRef) {
    return new User(userDocRef)
  }

  // Instance methods......................................................
  async addProjectToUser(project) {
    const projectDocRef = project.ref()

    // add project to user document...
    await this.userDocRef.update({
      projects: firestore.FieldValue.arrayUnion(projectDocRef)
    })

    const userSnapshot = await this.userDocRef.get()
    if (!userSnapshot.exists) {
      throw new util.UserDocumentUnavailable()
    }
    const user = userSnapshot.data()

    // add user to project's member's list...
    await projectDocRef.update({
      members: firestore.FieldValue.arrayUnion(user.email)
    })
  }

  async removeProjectFromUser(project) {
    const projectDocRef = project.ref()

    // remove project from user document...
    await this.userDocRef.update({
      projects: firestore.FieldValue.arrayRemove(projectDocRef)
    })

    const userSnapshot = await this.userDocRef.get()
    if (!userSnapshot.exists) {
      throw new util.UserDocumentUnavailable()
    }
    const user = userSnapshot.data()

    // remove user from project's member list...
    await projectDocRef.update({
      members: firestore.FieldValue.arrayRemove(user.email)
    })
  }

  ref() {
    return this.userDocRef
  }
}

module.exports = User
