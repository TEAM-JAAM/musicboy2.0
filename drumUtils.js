import Tone from 'tone'
import {AudioNode} from './utils'
import {kick, clap} from './instruments'

const drumSoundMap = {
  0: 'D1',
  1: '16n',
  2: '16'
}

const drumInstrumentMap = {
  0: kick,
  1: clap,
  2: clap
}

export class DrumGrid {
  constructor() {
    this.grid = []
    this.sequence = []
  }

  setUpGridFromSlices(drumslices) {
    if (drumslices) {
      console.log('setUpGridFromSlices was called!')
      const docsArray = drumslices.docs
      const slicesArray = []
      for (let i = 0; i < docsArray.length; ++i) {
        const singleDoc = docsArray[i].data()
        const slice = []
        slicesArray.push(slice)
        for (let j = 0; j < 3; ++j) {
          const node = new AudioNode(
            j,
            i,
            drumSoundMap[j],
            drumInstrumentMap[j]
          )
          if (singleDoc[j]) node.status = true
          slicesArray[i].push(node)
        }
      }
      this.grid = slicesArray
    }
  }

  updateSlice(sliceIndex, updatedDrumslice) {
    if (this.grid.length) {
      this.grid[sliceIndex].forEach(cell => {
        if (updatedDrumslice[cell.row] !== cell.status) {
          cell.status = !cell.status
        }
      })
    }
  }

  getGridSize() {
    return this.grid.length
  }
}
