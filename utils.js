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
  constructor() {
    this.key = null
    this.instrument = null
    this.grid = []
    this.sequence = []
  }

  setUpGrid(slices) {
    if (slices && this.key && this.instrument) {
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
      this.grid = nodeArray
    } else {
      console.log('No slices were passed to the grid')
    }
  }

  setKey(keyName) {
    this.key = keyName
  }
  setUpSequence() {
    let chordSequence = this.grid.map(slice => {
      return slice.map(node => {
        if (node.status) {
          return node.pitch
        }
      })
    })
    this.sequence = this.createNewSequence(chordSequence)
  }

  createNewSequence(chordsArray) {
    let chordArr = chordsArray.map(chord => {
      return new Tone.Event(null, chord)
    })

    const seq = new Tone.Sequence(
      function(time, note) {
        this.instrument.triggerAttackRelease(note, '32n', time)
      },
      chordArr,
      '4n'
    ).start(0)
    console.log('seq in createNewSequence', seq)
    this.sequence = seq
  }

  updateSequence(cell) {
    const timeSlice = cell.timeSlice
    let eventToUpdate = this.sequence._events[timeSlice].value
    if (Array.isArray(eventToUpdate)) {
      if (eventToUpdate.includes(cell.pitch)) {
        eventToUpdate = eventToUpdate.filter(note => note !== cell.pitch)
      } else {
        eventToUpdate.push(cell.pitch)
      }
    } else {
      eventToUpdate = [cell.pitch]
    }
  }

  // addNewTimesliceBlock() {
  //   console.log('INSTRUMENT: trying to add a new timeslice block to the grid')
  // }
  //   removeTimesliceBlock = () => console.log('INSTRUMENT: trying to remove a timeslice block')
  //   setKey = (key) => {
  //     this.key = key
  //     console.log('INSTRUMENT: trying to set the key to: ', key)
  //   }
  //   setCell = (row, col, value) => {
  //     console.log('INSTRUMENT: changing the value of: (', row, ',', col, ') to ', value)
  //   }
}
