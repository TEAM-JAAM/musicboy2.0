const util = require('../utils/dbUtils')

//
// --[ Timeslice ]------------------------------------------------------------
//
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
    newTimesliceDocRef.set({
      index: Number(objectData.index),
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
    })

    return new Timeslice(newTimesliceDocRef)
  }

  static fromDocRef(timesliceDocRef) {
    return new timesliceDocRef()
  }

  // Instance methods..........................................................
  update(index, value) {
    this.timesliceDocRef.update({
      [`${index}`]: value
    })
  }

  // Return the Firestore reference to this timeslice document
  ref() {
    return this.timesliceDocRef
  }
}

module.exports = Timeslice
