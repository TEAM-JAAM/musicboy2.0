import Tone from 'tone'
import {AudioNode} from './utils'
import {kick, clap} from './instruments'

const drumSoundMap = {
  0: '16n',
  1: '16n',
  2: 'D1'
}

const drumInstrumentMap = {
  0: clap,
  1: clap,
  2: kick
}

export class DrumGrid {
  constructor() {
    this.grid = []
    this.kicks = []
    this.claps = []
    this.kickSequence = []
    this.clapSequence = []
  }

  setUpGridFromSlices(sortedDocsArray) {
    if (sortedDocsArray) {
      const slicesArray = []
      console.log('drumslices sorted...', sortedDocsArray)
      // const docsArray = drumslices.docs;
      for (let i = 0; i < sortedDocsArray.length; ++i) {
        const slice = []
        // const singleDoc = docsArray[i].data();
        const singleDoc = sortedDocsArray[i]
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
      this.setUpSequences()
    }
  }

  updateSequences() {}

  setUpSequences() {
    this.kicks = []
    this.claps = []
    for (let i = 0; i < this.grid.length; ++i) {
      this.kicks.push('D1')
      this.claps.push('16n')
    }

    this.kickSequence = new Tone.Sequence(
      function(time, note) {
        kick.triggerAttackRelease(note, '32n', time)
      },
      this.kicks,
      '4n'
    ).start(0)

    this.clapSequence = new Tone.Sequence(
      function(note) {
        clap.triggerAttackRelease(note)
      },
      this.claps,
      '4n'
    ).start(0)

    this.grid.forEach((slice, idx) => {
      if (!slice[2].status) this.kickSequence._events[idx].mute = true
      else this.kickSequence._events[idx].mute = false

      if (!slice[1].status) this.clapSequence._events[idx].mute = true
      else this.clapSequence._events[idx].mute = false
    })
  }

  updateSequenceSlice(sliceIndex, rowIndex) {
    switch (rowIndex) {
      case 2:
        this.kickSequence._events[sliceIndex].mute = !this.kickSequence._events[
          sliceIndex
        ].mute
        break
      case 1:
        this.clapSequence._events[sliceIndex].mute = !this.clapSequence._events[
          sliceIndex
        ].mute
        break
      default:
        break
    }
  }

  updateSlice(sliceIndex, updatedDrumslice) {
    if (this.grid.length) {
      this.grid[sliceIndex].forEach(cell => {
        let rowIndex = cell.row
        if (updatedDrumslice[rowIndex] !== cell.status) {
          cell.status = !cell.status
          this.updateSequenceSlice(sliceIndex, rowIndex)
        }
      })
    }
  }

  playCell(row, col) {
    let cell = this.grid[col][row]
    if (cell.instrument !== kick) {
      cell.instrument.triggerAttackRelease('16n')
    } else {
      cell.instrument.triggerAttackRelease(cell.pitch, '16n')
    }
  }

  getGridSize() {
    return this.grid.length
  }
}
