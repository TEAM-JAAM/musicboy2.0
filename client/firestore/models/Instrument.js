const util = require('../utils/dbUtils')
const Timeslice = require('./Timeslice')

const INITIAL_TIMESLICES = 8
//
// --[ Instrument ]-----------------------------------------------------------
//
class Instrument {
  constructor(parentProject, instrumentDocSnapshot) {
    this.parentProject = parentProject
    this.instrumentDocSnapshot = instrumentDocSnapshot
  }

  // Create a new instrument AND a set of 8 timeslices
  // Mandatory fields: name
  static async create(parentProject, objectData) {
    const mandatoryFields = ['name']
    if (!util.allMandatoryFieldsProvided(objectData, mandatoryFields)) {
      throw new util.MissingMandatoryFieldError(mandatoryFields)
    }

    // populate default data...
    const defaults = {
      currentUser: '',
      key: 'G'
    }
    util.populateDefaults(objectData, defaults)

    console.log('NOTE: creating new instrument...', objectData)
    const projectDocRef = parentProject.ref()
    const newInstrumentDocRef = projectDocRef
      .collection('instruments')
      .doc(objectData.name)
    await newInstrumentDocRef.set(objectData)

    const newInstrumentDocSnapshot = await newInstrumentDocRef.get()
    const newInstrument = new Instrument(
      parentProject,
      newInstrumentDocSnapshot
    )
    for (let i = 0; i < INITIAL_TIMESLICES; ++i) {
      await Timeslice.create(newInstrument, {
        index: `${i}`
      })
    }

    return newInstrument
  }

  // Return the data associated with this project
  data() {
    return this.instrumentDocSnapshot.data()
  }

  // Return the Firestore reference to this instrument document
  ref() {
    return this.instrumentDocSnapshot.ref
  }
}

module.exports = Instrument
