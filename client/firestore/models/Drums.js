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

  static fetchDrumsData(documentQuerySnapshot) {
    return documentQuerySnapshot && documentQuerySnapshot.data()
  }

  static findDrumslicesQuery(docRef) {
    return docRef && docRef.collection('drumslices')
  }

  static fetchDrumsliceDocRefs(querySnapshot) {
    return querySnapshot && querySnapshot.docs
  }

  static fromDocRef(drumsDocRef) {
    return drumsDocRef && new Drums(drumsDocRef)
  }

  // Instance methods..........................................................
  async addDrumsliceBlock(startingIndex, numberOfDrumslices) {
    const drumsDocSnapshot = await this.drumsDocRef.get()
    if (!drumsDocSnapshot.exists) {
      throw new util.DatabaseInconsistentError()
    }
    for (let i = startingIndex; i < startingIndex + numberOfDrumslices; ++i) {
      await Drumslice.create(this, {index: `${i}`})
    }
  }

  async removeDrumsliceBlock(finalIndex, numberOfDrumslices) {
    const drumsDocSnapshot = await this.drumsDocRef.get()
    if (!drumsDocSnapshot.exists) {
      throw new util.DatabaseInconsistentError()
    }
    for (let i = finalIndex - 1; i > finalIndex - numberOfDrumslices - 1; --i) {
      await Drumslice.destroy(this, i)
    }
  }

  async clearAllDrumSlices() {
    const drumsDocSnapshot = await this.drumsDocRef.get()
    if (!drumsDocSnapshot.exists) {
      throw new util.DatabaseInconsistentError()
    }
    const drumslicesCollectionRef = this.drumsDocRef.collection('drumslices')
    const drumslicesQuerySnapshot = await drumslicesCollectionRef.get()
    const drumslicesDocs = drumslicesQuerySnapshot.docs
    for (let i = 0; i < drumslicesDocs.length; ++i) {
      const drumslice = Drumslice.fromDocRef(drumslicesDocs[i].ref)
      await drumslice.reset()
    }
  }

  async destroy() {
    const drumslicesCollectionRef = this.drumsDocRef.collection('drumslices')
    const drumslicesQuerySnapshot = await drumslicesCollectionRef.get()

    // Delete all of the drumslices...
    console.log('NOTE: attempting to delete timeslices')
    const drumslicesDocs = drumslicesQuerySnapshot.docs
    for (let i = 0; i < drumslicesDocs.length; ++i) {
      await drumslicesDocs[i].ref.delete()
    }

    // Delete the instrument document
    await this.drumsDocRef.delete()

    // Invalidate this object...
    this.drumsDocRef = null
  }

  ref() {
    return this.drumsDocRef
  }
}

module.exports = Drums
