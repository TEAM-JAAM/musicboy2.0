const {db} = require('../db')
const Instrument = require('./Instrument')
const util = require('../utils/dbUtils')

//
// --[ Project ]--------------------------------------------------------------
//
// This class, when instantiated, represents the Firestore document
// associated with a single project.
//
class Project {
  constructor(projectDocSnapshot) {
    this.projectDocSnaphot = projectDocSnapshot
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
      return new Project(projects.docs[0])
    } else {
      // populate default data...
      const defaults = {
        members: [],
        permissions: 'Private',
        tempo: 60
      }
      util.populateDefaults(objectData, defaults)

      console.log('NOTE: creating new project...', objectData)
      const newProjectDocRef = await projectCollectionRef.add(objectData)
      const newProjectDocSnapshot = await newProjectDocRef.get()
      return new Project(newProjectDocSnapshot)
    }
  }

  // Find an already-existing project for a user (or public project) by
  // its project ID. If not found, undefined will be returned
  static async findByPk(projectDocId) {
    const projectDocRef = db.collection('projects').doc(projectDocId)
    const projectDocSnapshot = await projectDocRef.get()
    if (projectDocSnapshot.exists) return new Project(projectDocSnapshot)

    return undefined
  }

  // Instance methods.........................................................
  // Create a new child instrument and also create the instrument's initial
  // set of timeslices
  addInstrument(objectData) {
    return Instrument.create(this, objectData)
  }

  async getInstruments() {
    const projectDocRef = this.ref()
    const instrumentQuerySnapshot = await projectDocRef
      .collection('instruments')
      .get()
    if (instrumentQuerySnapshot.empty) return undefined

    const instruments = []
    instrumentQuerySnapshot.forEach(instrumentDocSnapshot => {
      instruments.push(new Instrument(this, instrumentDocSnapshot))
    })

    return instruments
  }

  // Return the data associated with this project
  data() {
    return this.projectDocSnaphot.data()
  }

  // Return the Firestore reference to this project document
  ref() {
    return this.projectDocSnaphot.ref
  }
}

module.exports = Project
