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

export const initGrid = (width = 1) => {
  let musicArray = []

  for (let j = 0; j < 12; ++j) {
    musicArray.push([])
    for (let i = 0; i < width; i++) {
      let node = new AudioNode(j, i, assignPitch[j])
      musicArray[j].push(node)
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
    //node.status ? node.pitch : null,
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
