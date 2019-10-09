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

export const toggleCell = cell => {
  if (!cell.status) cell.instrument.triggerAttackRelease(cell.pitch, '16n')
  cell.status = !cell.status
}

export const createNewSequence = gridObj => {
  let chordsArray = []
  let arr = Object.values(gridObj)
  console.log('grid', gridObj)
  for (let i = 0; i < arr.length; ++i) {
    let slice = Object.values(arr[i])
    let chord = []
    for (let j = 0; j < slice.length; ++j) {
      let node = slice[j]
      if (node.status) chord.push(node.pitch)
    }
    chordsArray.push(chord)
  }
  console.log('chordsArray', chordsArray)

  let chordArr = chordsArray.map(chord => {
    return new Tone.Event(null, chord)
  })

  const seq = new Tone.Sequence(
    function(time, note) {
      synth.triggerAttackRelease(note, '32n', time)
    },
    chordArr,
    '4n'
  ).start(0)
  console.log('seq in createNewSequence', seq)
  return seq
}

export const updateSequence = (sequence, cell) => {
  console.log('seq in updateSequence', sequence)
  console.log('cell in updateSequence', cell)
  const timeSlice = cell.timeSlice
  let eventToUpdate = sequence._events[timeSlice].value
  if (Array.isArray(eventToUpdate)) {
    if (eventToUpdate.includes(cell.pitch)) {
      eventToUpdate = eventToUpdate.filter(note => note !== cell.pitch)
    } else {
      eventToUpdate.push(cell.pitch)
    }
  } else {
    eventToUpdate = [cell.pitch]
  }
  return sequence
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
