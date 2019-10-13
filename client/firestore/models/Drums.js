const {db, firestore} = require('../db')
const util = require('../utils/dbUtils')
const Drumslice = require('./Drumslice')

//
// ---[ Drums ]----------------------------------------------------------------
//
class Drums {
  constructor(drumsDocRef) {
    this.drumsDocRef = drumsDocRef
  }

  // static methods...............................................................
  static async create(parentProject, drumslices) {
    const objectData = {
      name: 'drums',
      key: 'DRUMS'
    }

    console.log('NOTE: creating new drums...', objectData)
    const parentProjectDocRef = parentProject.ref()
    const newDrumsDocRef = parentProjectDocRef
      .collection('percussion')
      .doc(objectData.name)
    await newDrumsDocRef.set(objectData)
    console.log('drums successfully written!')

    const newDrums = new Drums(newDrumsDocRef)
    console.log('new drums!', newDrums)
    for (let i = 0; i < drumslices; ++i) {
      await Drumslice.create(newDrums, {index: `${i}`})
      console.log(`successfully created drumslice => ${i}`)
    }

    return newDrums
  }
}

module.exports = Drums
