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

export const createSequence = row => {
  const seq = new Tone.Sequence(
    function(time, note) {
      synth.triggerAttackRelease(note, '32n', time)
    },
    row.reduce((accum, node) => {
      if (node.status) accum.push(node.pitch)
      else accum.push(null)
      return accum
    }, []),
    '8n'
  ).start(0)
  return seq
}

export const startMusic = () => {
  console.log('music started')
  Tone.Transport.start()
}

export const stopMusic = () => {
  console.log('music stopped')
  Tone.Transport.stop()
}
