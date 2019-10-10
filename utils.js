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
    // console.log('THIS GRID', this.grid)
    // console.log('THIS key', this.key)
    // console.log('THIS instrument', this.instrument)
    //console.log('THIS GRID', this.grid)
    if (slices && this.key && this.instrument) {
      console.log('INSIDE IF ----', slices)
      console.log('THIS GRID', this.grid)
      console.log('THIS key', this.key)
      // console.log('THIS instrument', this.instrument)
      let nodeArray = []
      console.log('slices data', slices.docs)
      let docsArray = slices.docs
      for (let i = 0; i < docsArray.length; ++i) {
        console.log('slices data', docsArray[i].data())
        let singleDoc = docsArray[i].data()

        nodeArray.push([])
        for (let j = 0; j < 12; ++j) {
          let node = new AudioNode(j, i, this.key[j], this.instrument)
          if (singleDoc[j]) {
            node.status = true
          }
          nodeArray[i].push(node)
        }
      }
      this.grid = nodeArray
      console.log('OUR GRID', this.grid)
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
    console.log('WE ARE SETTING OUR KEY', this.key)
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
    console.log('WE ARE SETTING OUR INSTRUMENT', this.instrument)
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

  playCell(row, col) {
    //creates a change in status
    console.log('THIS GRID', this.grid)
    let cell = this.grid[col][row]
    console.log('cell', cell)
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
