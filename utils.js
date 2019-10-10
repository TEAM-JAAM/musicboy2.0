import Tone from 'tone'
import {synth, assignPitch} from './instruments'

export class AudioNode {
  constructor(row, index, pitch, instrument) {
    this.row = row
    this.index = index
    this.status = false
    this.pitch = pitch
    this.instrument = instrument
  }
}

export const toggleCell = cell => {
  if (!cell.status) synth.triggerAttackRelease(cell.pitch, '16n')
  cell.status = !cell.status
}

export const addRowToGrid = grid => {
  return grid.map((row, idx) => {
    const pitch = row[0].pitch
    const rowIndex = idx
    const colIndex = row.length
    const node = new AudioNode(rowIndex, colIndex, pitch)
    row.push(node)
    return row
  })
}

export const removeRowFromGrid = grid => {
  return grid.map(row => {
    row.pop()
    return row
  })
}

export const startMusic = () => {
  Tone.Transport.start()
}

export const stopMusic = () => {
  Tone.Transport.stop()
}

export class Grid {
  constructor(collectionOfSlices, key, instrument) {
    this.slices = collectionOfSlices
    this.key = key
    this.instrument = instrument
    this.grid = this.setUpGrid(this.slices)
    this.sequence = this.setUpSequence()
  }

  setUpGrid(slices) {
    let nodeArray = []
    for (let i = 0; i < slices.length; ++i) {
      let booleanArray = Object.entries(slices[i].data())
      nodeArray.push([])
      for (let j = 0; j < 12; ++j) {
        let node = new AudioNode(j, i, this.key[j], this.instrument)
        if (booleanArray[j]) {
          node.status = true
        }
        nodeArray[j].push(node)
      }
    }
    return nodeArray
  }

  setUpSequence() {
    let chordSequence = this.grid.map(slice => {
      return slice.map(node => {
        if (node.status) {
          return node.pitch
        }
      })
    })
    return createNewSequence(chordSequence)
  }

  createNewSequence(arr) {
    const seq = new Tone.Sequence(
      function(time, note) {
        synth.triggerAttackRelease(note, '32n', time)
      },

      row.reduce((accum, node) => {
        if (node.status) accum.push(node.pitch)
        else accum.push(0)
        return accum
      }, []),
      '4n'
    ).start(0)
    return seq
  }

  updateSequences = (sequencesArray, row, rowIdx) => {
    return sequencesArray.map((sequence, idx) => {
      if (idx === rowIdx) {
        sequence.cancel()
        return createNewSequence(row)
      } else {
        return sequence
      }
    })
  }

  addNewTimesliceBlock() {
    console.log('INSTRUMENT: trying to add a new timeslice block to the grid')
  }
  //   removeTimesliceBlock = () => console.log('INSTRUMENT: trying to remove a timeslice block')
  //   setKey = (key) => {
  //     this.key = key
  //     console.log('INSTRUMENT: trying to set the key to: ', key)
  //   }
  //   setCell = (row, col, value) => {
  //     console.log('INSTRUMENT: changing the value of: (', row, ',', col, ') to ', value)
  //   }
}
