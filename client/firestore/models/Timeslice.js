const util = require('../utils/dbUtils')

//
// --[ Timeslice ]------------------------------------------------------------
//
class Timeslice {
  constructor(parentInstrument, timesliceDocSnapshot) {
    this.parentInstrument = parentInstrument
    this.timesliceDocSnapshot = timesliceDocSnapshot
  }

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

    const newTimesliceDocSnapshot = await newTimesliceDocRef.get()
    return new Timeslice(parentInstrument, newTimesliceDocSnapshot)
  }

  // Return the data associated with this project
  data() {
    return this.timesliceDocSnapshot.data()
  }

  // Return the Firestore reference to this timeslice document
  ref() {
    return this.timesliceDocSnapshot.ref
  }
}

module.exports = Timeslice
