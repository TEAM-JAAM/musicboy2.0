const util = require('../utils/dbUtils')
const Timeslice = require('./Timeslice')

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
  static async create(parentProject, objectData, timeslices) {
    const mandatoryFields = ['name']
    if (!util.allMandatoryFieldsProvided(objectData, mandatoryFields)) {
      throw new util.MissingMandatoryFieldError(mandatoryFields)
    }

    // populate default data...
    const defaults = {
      currentUser: '',
      key: 'G_MAJOR'
    }
    util.populateDefaults(objectData, defaults)

    console.log('NOTE: creating new instrument...', objectData)
    const projectDocRef = parentProject.ref()
    const newInstrumentDocRef = projectDocRef
      .collection('instruments')
      .doc(objectData.name)
    await newInstrumentDocRef.set(objectData)

    const newInstrument = new Instrument(newInstrumentDocRef)
    for (let i = 0; i < timeslices; ++i) {
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

  static update(documentQuerySnapshot, objectData) {
    documentQuerySnapshot.ref.update(objectData)
  }

  // Instance methods.........................................................
  async addTimesliceBlock(startingIndex, numberOfTimeslices) {
    const instrumentDocSnapshot = await this.instrumentDocRef.get()
    if (!instrumentDocSnapshot.exists) {
      throw new util.DatabaseInconsistentError()
    }
    for (let i = startingIndex; i < startingIndex + numberOfTimeslices; ++i) {
      await Timeslice.create(this, {
        index: `${i}`
      })
    }
  }

  async removeTimesliceBlock(finalIndex, numberOfTimeslices) {
    const instrumentDocSnapshot = await this.instrumentDocRef.get()
    if (!instrumentDocSnapshot.exists) {
      throw new util.DatabaseInconsistentError()
    }
    for (let i = finalIndex - 1; i > finalIndex - numberOfTimeslices; --i) {
      await Timeslice.destroy(this, i)
    }
  }

  async destroy() {
    // Find the timeslices collection...
    const timeslicesCollectionRef = this.instrumentDocRef.collection(
      'timeslices'
    )
    const timeslicesQuerySnapshot = await timeslicesCollectionRef.get()

    // Delete all of the timeslices...
    console.log('NOTE: attempting to delete timeslices')
    const timeslicesDocs = timeslicesQuerySnapshot.docs
    for (let i = 0; i < timeslicesDocs.length; ++i) {
      await timeslicesDocs[i].ref.delete()
    }

    // Delete the instrument document
    await this.instrumentDocRef.delete()

    // Invalidate this object...
    this.instrumentDocRef = null
  }

  // Return the Firestore reference to this instrument document
  ref() {
    return this.instrumentDocRef
  }
}

module.exports = Instrument
