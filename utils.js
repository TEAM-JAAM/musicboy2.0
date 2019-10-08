import Tone from 'tone'
import {synth, G_MAJOR} from './instruments'

export class AudioNode {
  constructor(timeSlice, row, pitch, instrument) {
    this.timeSlice = timeSlice
    this.row = row
    this.status = false
    this.pitch = pitch
    this.instrument = instrument
  }
}

// export const initGrid = width => {
//   const grid = {}
//   for (let i = 0; i < width; ++i) {
//     const timeSlice = i
//     grid[timeSlice] = {}
//     for (let j = 0; j < 12; ++j) {
//       let node = new AudioNode(i, j, G_MAJOR[j])
//       grid[timeSlice][j] = node
//     }
//   }
//   return grid
// }

export const toggleCell = cell => {
  if (!cell.status) cell.instrument.triggerAttackRelease(cell.pitch, '16n')
  cell.status = !cell.status
}

export const createNewSequence = row => {
  row = Object.values(row)
  const seq = new Tone.Sequence(
    function(time, note) {
      synth.triggerAttackRelease(note, '16n', time)
    },
    row.reduce((accum, node) => {
      if (node.status) accum.push(node.pitch)
      else accum.push(0)
      return accum
    }, []),
    '8n'
  ).start(0)
  return seq
}

export const updateSequences = (sequencesArray, timeSlice, rowIdx) => {
  return sequencesArray.map((sequence, idx) => {
    if (idx === rowIdx) {
      sequence.cancel()
      return createNewSequence(timeSlice)
    } else {
      return sequence
    }
  })
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
