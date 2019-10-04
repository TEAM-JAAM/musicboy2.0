import Tone from 'tone'
import {assignPitch} from './scales'

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

const synth = new Tone.PolySynth({
  polyphony: 12,
  voice: Tone.Synth
}).toMaster()

export const toggleCell = cell => {
  cell.status = !cell.status
  synth.triggerAttackRelease('G4', '16n')
}

export const createSequence = arr => {
  let seq = new Tone.Sequence(
    (time, note) => {
      synth.triggerAttackRelease(note, '32n', time)
    },
    arr.reduce((accumulator, node) => {
      if (node.status) {
        accumulator.push('G4')
      } else {
        accumulator.push(null)
      }
      return accumulator
    }, []),
    '4n'
  )
  return seq
}

export const startMusic = () => {
  Tone.Transport.start()
}

export const stopMusic = () => {
  Tone.Transport.stop()
}
