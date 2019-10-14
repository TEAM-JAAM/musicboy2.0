const {db, firestore} = require('../db')
const util = require('../utils/dbUtils')

const INITIAL_STATE = {
  0: false,
  1: false,
  2: false
}
//
// ---[ drumslice ]--------------------------------------------------------
//
class Drumslice {
  constructor(drumsliceDocRef) {
    this.drumsliceDocRef = drumsliceDocRef
  }

  // static methods.......................................................
  static async create(parentDrums, objectData) {
    const mandatoryFields = ['index']
    if (!util.allMandatoryFieldsProvided(objectData, mandatoryFields)) {
      throw new util.MissingMandatoryFieldError(mandatoryFields)
    }

    console.log('NOTE: creating new drumslice...', objectData)
    const newDrumsliceDocRef = await parentDrums.drumsDocRef
      .collection('drumslices')
      .doc(objectData.index)
    newDrumsliceDocRef.set(INITIAL_STATE)

    return new Drumslice(newDrumsliceDocRef)
  }

  static fetchDrumsliceIndex(drumsliceQuerySnapshot) {
    return drumsliceQuerySnapshot && drumsliceQuerySnapshot.id
  }

  static fetchDrumsliceData(drumsliceQuerySnapshot) {
    return drumsliceQuerySnapshot && drumsliceQuerySnapshot.data()
  }

  static fromDocRef(drumsliceDocRef) {
    return new Drumslice(drumsliceDocRef)
  }

  static update(documentQuerySnapshot, rowIndex, newStatus) {
    console.log(`trying to set cell at index ${rowIndex} to value ${newStatus}`)
    documentQuerySnapshot.ref.update({
      [`${rowIndex}`]: newStatus
    })
  }

  // Instance methods..........................................................
  ref() {
    return this.drumsliceDocRef
  }

  reset() {
    this.drumsliceDocRef.set(INITIAL_STATE)
  }
}

module.exports = Drumslice
