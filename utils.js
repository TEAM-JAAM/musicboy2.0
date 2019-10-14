import Tone from 'tone'

import {
  synth,
  electricCello,
  steelPan,
  marimba,
  bassGuitar,
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

function compareNumbers(a, b) {
  return a.id - b.id
}

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
      console.log('SETUP GRID CALLED')
      this.chordArray = []
      let nodeArray = []
      let docsArray = slices
      // docsArray = docsArray.sort(compareNumbers)
      // console.log('DOC ARRAY', docsArray)
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

      console.log('SETUP GRID CALLED', this.grid)
      if (!this.sequence.length) {
        this.createNewSequence(this.chordArray)
      } else {
        this.sequence.cancel()
        this.createNewSequence(this.chordArray)
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
    console.log('chordarray before key update', this.chordArray)
    let chordArr = []
    this.grid.forEach(slice => {
      let chord = []
      slice.forEach(node => {
        node.pitch = this.key[node.row]
        if (node.status) {
          chord.push(node.pitch)
        }
      })
      chordArr.push(chord)
    })
    this.chordArray = chordArr
    console.log('chordarray after key update', this.chordArray)
    if (this.sequence.length) {
      this.sequence.cancel()
      this.createNewSequence(this.chordArray)
    }
    console.log('WE ARE SETTING OUR KEY', this.grid)
  }

  setInstrument(inst) {
    const instrumentMap = {
      synth: synth,
      electricCello: electricCello,
      steelPan: steelPan,
      marimba: marimba,
      bassGuitar: bassGuitar
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
    let counter = -1
    const seq = new Tone.Sequence(
      function(time, chord) {
        inst.triggerAttackRelease(chord, '32n', time)
        Tone.Draw.schedule(() => {
          counter++
          let tempCol = document.querySelectorAll(`#column${counter}`)
          console.log('TEMP COL', tempCol)
          tempCol.forEach(col =>
            col.setAttribute('style', 'background-color: red;')
          )
          if (counter > 0) {
            let removeTemp = document.querySelectorAll(`#column${counter - 1}`)
            removeTemp.forEach(col =>
              col.removeAttribute('style', 'background-color: red;')
            )
          }
        }, time)
      },
      chordArr,
      '4n'
    ).start(0)
    this.sequence = seq
    console.log('OUR SEQUENCE', this.sequence)
  }

  updateSequenceSlice(cell) {
    if (this.sequence._events[cell.index].value.includes(cell.pitch)) {
      this.sequence._events[cell.index].value = this.sequence._events[
        cell.index
      ].value.filter(pitch => {
        if (pitch !== cell.pitch) return pitch
      })
    } else {
      this.sequence._events[cell.index].value.push(cell.pitch)
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
          const cellToUpdate = this.grid[index][cell.row]
          cellToUpdate.status = singleSlice[cell.row]
          this.updateSequenceSlice(cellToUpdate)
        }
      })
    }
  }

  getGridSize() {
    return this.grid.length
  }
}
