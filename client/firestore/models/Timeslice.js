const util = require('../utils/dbUtils')

//
// --[ Timeslice ]------------------------------------------------------------
//
const INITIAL_STATE = {
  0: false,
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
  6: false,
  7: false,
  8: false,
  9: false,
  10: false,
  11: false
}

class Timeslice {
  constructor(timesliceDocRef) {
    this.timesliceDocRef = timesliceDocRef
  }

  // Static Methods ..........................................................
  // Create a new timeslice
  // Mandatory fields: index: the index of the timeslice, starting at 0
  // By default, a timeslice is a 12 note scale
  static async create(parentInstrument, objectData) {
    const mandatoryFields = ['index']
    if (!util.allMandatoryFieldsProvided(objectData, mandatoryFields)) {
      throw new util.MissingMandatoryFieldError(mandatoryFields)
    }

    console.log('NOTE: creating new timeslice...', objectData)
    const newTimesliceDocRef = await parentInstrument
      .ref()
      .collection('timeslices')
      .doc(objectData.index)
    newTimesliceDocRef.set(INITIAL_STATE)

    return new Timeslice(newTimesliceDocRef)
  }

  static async destroy(parentInstrument, index) {
    console.log('NOTE: removing timeslice @ index: ', index)
    const timesliceDocRef = await parentInstrument
      .ref()
      .collection('timeslices')
      .doc(index.toString())
    await timesliceDocRef.delete()
  }

  static fetchTimesliceData(documentQuerySnapshot) {
    return documentQuerySnapshot && documentQuerySnapshot.data()
  }

  static fetchTimesliceIndex(documentQuerySnapshot) {
    return documentQuerySnapshot && documentQuerySnapshot.id
  }

  static fromDocRef(timesliceDocRef) {
    return new Timeslice(timesliceDocRef)
  }

  static update(documentQuerySnapshot, index, value) {
    console.log('trying to set index: ', index, ' to value: ', value)
    documentQuerySnapshot.ref.update({
      [`${index}`]: value
    })
  }

  // Instance methods..........................................................
  // Reinitialize all of the timeslice data to false...
  reset() {
    this.timesliceDocRef.set(INITIAL_STATE)
  }

  // Return the Firestore reference to this timeslice document
  ref() {
    return this.timesliceDocRef
  }
}

module.exports = Timeslice
