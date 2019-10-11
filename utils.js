import Tone from 'tone'

import {
  synth,
  tiny,
  kalimba,
  electricCello,
  steelPan,
  marimba,
  electric,
  bassGuitar,
  pianoetta,
  G_MAJOR,
  G_MINOR,
  PENTATONIC
} from './instruments'

export class AudioNode {
  constructor(row, index, pitch, instrument) {
    this.row = row
    this.index = index
    this.status = false
    this.pitch = pitch
    this.instrument = instrument
  }
}

// broken right now (friday)
// export const addRowToGrid = grid => {
//   return grid.map((row, idx) => {
//     const pitch = row[0].pitch
//     const rowIndex = idx
//     const colIndex = row.length
//     const node = new AudioNode(rowIndex, colIndex, pitch)
//     row.push(node)
//     return row
//   })
// }

// export const removeRowFromGrid = grid => {
//   return grid.map(row => {
//     row.pop()
//     return row
//   })
// }

export class Grid {
  constructor() {
    this.key = null
    this.instrument = null
    this.grid = []
    this.sequence = []
    this.chordArray = []
  }

  setUpGrid(slices) {
    if (slices && this.key && this.instrument) {
      this.chordArray = []
      let nodeArray = []
      let docsArray = slices.docs
      for (let i = 0; i < docsArray.length; ++i) {
        let singleDoc = docsArray[i].data()
        nodeArray.push([])
        let chord = []
        for (let j = 0; j < 12; ++j) {
          let node = new AudioNode(j, i, this.key[j], this.instrument)
          if (singleDoc[j]) {
            node.status = true
            chord.push(node.pitch)
          }
          nodeArray[i].push(node)
        }
        this.chordArray.push(chord)
      }
      this.grid = nodeArray
      if (!this.sequence.length) {
        this.createNewSequence(this.chordArray)
      } else {
        this.sequence._events.forEach((chord, idx) => {
          if (chord.value.length !== this.chordArray[idx].length)
            chord.value = this.chordArray[idx]
        })
      }
    } else {
      console.log('No slices were passed to the grid')
    }
  }

  setKey(keyName) {
    const keyMap = {
      G_MAJOR: G_MAJOR,
      G_MINOR: G_MINOR,
      PENTATONIC: PENTATONIC
    }
    this.key = keyMap[keyName]
    //console.log('WE ARE SETTING OUR KEY', this.key)
  }

  setInstrument(inst) {
    const instrumentMap = {
      synth: synth,
      tiny: tiny,
      kalimba: kalimba,
      electricCello: electricCello,
      steelPan: steelPan,
      marimba: marimba,
      electric: electric,
      bassGuitar: bassGuitar,
      pianoetta: pianoetta
    }
    this.instrument = instrumentMap[inst]
    this.grid.forEach(slice => {
      slice.forEach(node => {
        node.instrument = this.instrument
      })
    })
    if (this.sequence.length) {
      this.sequence.cancel()
      this.createNewSequence(this.chordArray)
    }
    console.log('WE ARE SETTING OUR INSTRUMENT', this.instrument)
  }

  createNewSequence(chordsArray) {
    let chordArr = chordsArray.map(chord => {
      return new Tone.Event(null, chord)
    })
    let inst = this.instrument
    const seq = new Tone.Sequence(
      function(time, chord) {
        inst.triggerAttackRelease(chord, '32n', time)
      },
      chordArr,
      '4n'
    ).start(0)

    this.sequence = seq
    // console.log('this sequence was just created', this.sequence)
  }

  updateSequenceSlice(cell) {
    console.log('updateSequence was just called')
    let eventToUpdate = this.sequence._events[cell.index].value
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

  playCell(row, col) {
    //creates a change in status
    let cell = this.grid[col][row]
    let instrument = cell.instrument
    instrument.triggerAttackRelease(cell.pitch, '16n')
  }

  updateSlice(index, singleSlice) {
    if (this.grid.length) {
      this.grid[index].forEach(cell => {
        if (singleSlice[cell.row] !== cell.status) {
          this.grid[index][cell.row].status = singleSlice[cell.row]
        }
      })
    }
  }
}
