const {db, firestore} = require('../db')
const Instrument = require('./Instrument')
const util = require('../utils/dbUtils')

//
// --[ Project ]--------------------------------------------------------------
//
// This class, when instantiated, represents the Firestore document
// associated with a single project.
//
class Project {
  constructor(projectDocRef) {
    this.projectDocRef = projectDocRef
  }

  // Static methods...........................................................
  // Find a project by name. If it exists, return a reference to it. If not,
  // create a new instance in the database
  // Mandatory fields: name
  static async findOrCreate(objectData) {
    const mandatoryFields = ['name']
    if (!util.allMandatoryFieldsProvided(objectData, mandatoryFields)) {
      throw new util.MissingMandatoryFieldError(mandatoryFields)
    }

    const projectCollectionRef = db.collection('projects')
    const projects = await projectCollectionRef
      .where('name', '==', objectData.name)
      .get()
    if (!projects.empty) {
      console.log('NOTE: found existing project data')
      return new Project(projects.docs[0].ref)
    } else {
      // populate default data...
      const defaults = {
        members: [],
        memberUids: [],
        permissions: 'Private',
        tempo: 60
      }
      util.populateDefaults(objectData, defaults)

      console.log('NOTE: creating new project...', objectData)
      const newProjectDocRef = await projectCollectionRef.add(objectData)
      return new Project(newProjectDocRef)
    }
  }

  // Find an already-existing project for a user (or public project) by
  // its project ID. If not found, undefined will be returned
  static async findByPk(projectDocId) {
    const projectDocRef = db.collection('projects').doc(projectDocId)
    const projectDocSnapshot = await projectDocRef.get()
    if (projectDocSnapshot.exists) return new Project(projectDocRef)

    return undefined
  }

  static findAllProjectsForUserQuery(uid) {
    return (
      uid &&
      db.collection('projects').where('memberUids', 'array-contains', uid)
    )
  }

  static fetchProjectData(querySnapshot) {
    const projects = []
    querySnapshot &&
      querySnapshot.forEach(queryDocSnapshot => {
        const project = queryDocSnapshot.data()
        project.docRef = queryDocSnapshot.ref
        projects.push(project)
      })
    return projects
  }

  static findAllInstruments(projectDocRef) {
    return projectDocRef.collection('instruments')
  }

  static fromDocRef(projectDocRef) {
    return new Project(projectDocRef)
  }

  // Instance methods.........................................................
  // Create a new child instrument and also create the instrument's initial
  // set of timeslices
  addInstrument(objectData) {
    return Instrument.create(this, objectData)
  }

  async addUserToProject(objectData) {
    const mandatoryFields = ['email', 'uid']
    if (!util.allMandatoryFieldsProvided(objectData, mandatoryFields)) {
      throw new util.MissingMandatoryFieldError(mandatoryFields)
    }

    await this.projectDocRef.update({
      members: firestore.FieldValue.arrayUnion(objectData.email),
      memberUids: firestore.FieldValue.arrayUnion(objectData.uid)
    })
  }

  async removeUserFromProject(objectData) {
    const mandatoryFields = ['email', 'uid']
    if (!util.allMandatoryFieldsProvided(objectData, mandatoryFields)) {
      throw new util.MissingMandatoryFieldError(mandatoryFields)
    }

    await this.projectDocRef.update({
      members: firestore.FieldValue.arrayRemove(objectData.email),
      memberUids: firestore.FieldValue.arrayRemove(objectData.uid)
    })
  }

  // Return the Firestore reference to this project document
  ref() {
    return this.projectDocRef
  }
}

module.exports = Project
