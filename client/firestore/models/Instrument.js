const util = require('../utils/dbUtils')
const Timeslice = require('./Timeslice')

const INITIAL_TIMESLICES = 8
//
// --[ Instrument ]-----------------------------------------------------------
//
class Instrument {
  constructor(instrumentDocRef) {
    this.instrumentDocRef = instrumentDocRef
  }

  // Static methods...........................................................
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

    const newInstrument = new Instrument(newInstrumentDocRef)
    for (let i = 0; i < INITIAL_TIMESLICES; ++i) {
      await Timeslice.create(newInstrument, {
        index: `${i}`
      })
    }

    return newInstrument
  }

  static fetchInstrumentData(documentQuerySnapshot) {
    return documentQuerySnapshot && documentQuerySnapshot.data()
  }

  static findInstrumentTimeslicesQuery(docRef) {
    return docRef && docRef.collection('timeslices')
  }

  static fetchTimesliceDocRefs(querySnapshot) {
    return querySnapshot && querySnapshot.docs
  }

  static fromDocRef(instrumentDocRef) {
    return instrumentDocRef && new Instrument(instrumentDocRef)
  }

  static update(documentQuerySnapshot, key, value) {
    documentQuerySnapshot.ref.update({
      [`${key}`]: value
    })
  }

  // Instance methods.........................................................
  // Return the Firestore reference to this instrument document
  ref() {
    return this.instrumentDocRef
  }
}

module.exports = Instrument
