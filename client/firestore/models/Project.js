const {db, firestore} = require('../db')
const Instrument = require('./Instrument')
const Drums = require('./Drums')
const util = require('../utils/dbUtils')

const TIMESLICE_BLOCK_SIZE = 8

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
      console.log('NOTE: updating existing project data')
      const projectDocRef = projects.docs[0].ref
      projectDocRef.update(objectData)
      return new Project(projectDocRef)
    } else {
      // populate default data...
      const defaults = {
        members: [],
        memberUids: [],
        permissions: 'Private',
        tempo: 60,
        timeslices: 8,
        drumslices: 8
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

  static findAllPublicProjectsQuery() {
    return db.collection('projects').where('permissions', '==', 'Public')
  }

  static findProjectQuery(documentId) {
    return documentId && db.collection('projects').doc(documentId)
  }

  static findProjectInstrumentsQuery(documentId) {
    return (
      documentId &&
      db
        .collection('projects')
        .doc(documentId)
        .collection('instruments')
    )
  }

  static findProjectPercussionQuery(documentId) {
    return (
      documentId &&
      db
        .collection('projects')
        .doc(documentId)
        .collection('percussion')
    )
  }

  static fetchAllProjectsData(querySnapshot) {
    const projects = []
    querySnapshot &&
      querySnapshot.forEach(queryDocSnapshot => {
        const project = queryDocSnapshot.data()
        project.docRef = queryDocSnapshot.ref
        projects.push(project)
      })
    return projects
  }

  static fetchProjectData(documentQuerySnapshot) {
    return documentQuerySnapshot && documentQuerySnapshot.data()
  }

  static fetchInstrumentDocRefs(querySnapshot) {
    return querySnapshot && querySnapshot.docs
  }

  static fetchPercussionDocRefs(querySnapshot) {
    return querySnapshot && querySnapshot.docs
  }

  static fromDocRef(projectDocRef) {
    return new Project(projectDocRef)
  }

  // Instance methods.........................................................
  // Create a new child instrument and also create the instrument's initial
  // set of timeslices. If the project's timeslice value was increased, create
  // the new instrument with the existing timeslice count...
  async addInstrument(objectData) {
    const timeslices = await this.getTimeslicesValue()
    return Instrument.create(this, objectData, timeslices)
  }

  async addDrums() {
    const drumslices = await this.getDrumslicesValue()
    return Drums.create(this, drumslices)
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

  async destroy() {
    // Deletion must occur from the bottom up, i.e., with the lowest document
    // in the document hierarchy. First, find all of the project's
    // instruments...
    const instrumentsCollectionRef = this.projectDocRef.collection(
      'instruments'
    )
    const instrumentsQuerySnapshot = await instrumentsCollectionRef.get()
    if (!instrumentsQuerySnapshot.empty) {
      console.log('NOTE: attempting to delete instruments...')
      // Find the instruments timeslices collection...
      const instrumentsDocs = instrumentsQuerySnapshot.docs
      for (let i = 0; i < instrumentsDocs.length; ++i) {
        // Delete each instrument (which also deletes all of the instrument's
        // timeslices...)
        const instrument = Instrument.fromDocRef(instrumentsDocs[i].ref)
        await instrument.destroy()
      }
    }
    // Finally, delete the project...
    this.projectDocRef.delete()
  }

  // Add a block (2 measures) of timeslices... When timeslice blocks are added
  // they are added to ALL existing instruments
  async addTimesliceBlock() {
    // Obtain the current timeslices value for the project...
    let timeslices = await this.getTimeslicesValue()

    // Add an additional block of timeslices to every instrument...
    const instrumentsCollectionRef = this.projectDocRef.collection(
      'instruments'
    )
    const instrumentsQuerySnapshot = await instrumentsCollectionRef.get()
    if (!instrumentsQuerySnapshot.empty) {
      // Find the instruments timeslices collection...
      const instrumentsDocs = instrumentsQuerySnapshot.docs
      for (let i = 0; i < instrumentsDocs.length; ++i) {
        // Add a block of timeslices to each instrument...
        const instrument = Instrument.fromDocRef(instrumentsDocs[i].ref)
        await instrument.addTimesliceBlock(timeslices, TIMESLICE_BLOCK_SIZE)
      }
    }

    // Finally, update the timeslices count in the project...
    timeslices += TIMESLICE_BLOCK_SIZE
    await this.projectDocRef.update({
      timeslices
    })
  }

  // Remove a block (2 measures) of timeslices... When timeslice blocks
  // are removed they are removed from ALL existing instruments
  async removeTimesliceBlock() {
    // Obtain the current timeslices value for the project...
    let timeslices = await this.getTimeslicesValue()
    if (timeslices === TIMESLICE_BLOCK_SIZE) {
      throw new util.InvalidDatabaseOperationError(
        'attempting to remove the initial timeslice set'
      )
    }

    // Remove one block of timeslices to every instrument...
    const instrumentsCollectionRef = this.projectDocRef.collection(
      'instruments'
    )
    const instrumentsQuerySnapshot = await instrumentsCollectionRef.get()
    if (!instrumentsQuerySnapshot.empty) {
      // Find the instruments timeslices collection...
      const instrumentsDocs = instrumentsQuerySnapshot.docs
      for (let i = 0; i < instrumentsDocs.length; ++i) {
        // Remove 1 block of timeslices from each instrument...
        const instrument = Instrument.fromDocRef(instrumentsDocs[i].ref)
        await instrument.removeTimesliceBlock(timeslices, TIMESLICE_BLOCK_SIZE)
      }
    }

    // Finally, update the timeslices count in the project...
    timeslices -= TIMESLICE_BLOCK_SIZE
    await this.projectDocRef.update({
      timeslices
    })
  }

  // Obtain the value of the timeslices field of this project
  async getTimeslicesValue() {
    const projectDocSnaphot = await this.projectDocRef.get()
    if (!projectDocSnaphot.exists) {
      throw new util.UnknownProjectError()
    }
    return projectDocSnaphot.data().timeslices
  }

  async getDrumslicesValue() {
    const projectDocSnapshot = await this.projectDocRef.get()
    if (!projectDocSnapshot.exists) {
      throw new util.UnknownProjectError()
    }
    return projectDocSnapshot.data().drumslices
  }

  // Return the Firestore reference to this project document
  ref() {
    return this.projectDocRef
  }
}

module.exports = Project
