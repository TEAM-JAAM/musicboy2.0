import Tone from 'tone'
import {synth, assignPitch} from './instruments'

export class AudioNode {
  constructor(row, index, pitch) {
    this.row = row
    this.index = index
    this.status = false
    this.pitch = pitch
  }
}

export const initGrid = (height, width) => {
  let musicArray = []
  for (let i = 0; i < height; ++i) {
    musicArray.push([])
    for (let j = 0; j < width; ++j) {
      let node = new AudioNode(i, j, assignPitch[i])
      musicArray[i].push(node)
    }
  }
  return musicArray
}

export const toggleCell = cell => {
  if (!cell.status) synth.triggerAttackRelease(cell.pitch, '16n')
  cell.status = !cell.status
}

export const createNewSequence = row => {
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

export const updateSequences = (sequencesArray, row, rowIdx) => {
  return sequencesArray.map((sequence, idx) => {
    if (idx === rowIdx) {
      sequence.cancel()
      return createNewSequence(row)
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
