import Tone from 'tone'

export class AudioNode {
  constructor(row, index) {
    this.row = row
    this.index = index
    this.status = false
  }
}

export const initRow = (length = 4) => {
  let musicArray = []
  for (let i = 0; i < length; i++) {
    musicArray.push(new AudioNode(0, i))
  }
  return musicArray
}

const synth = new Tone.Synth().toMaster()

export const toggleCell = cell => {
  cell.status = !cell.status
  synth.triggerAttackRelease('G4', '16n')
}

export const playMusic = arr => {
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
  ).start(0)
  Tone.Transport.start()
}

export const stopMusic = () => {
  Tone.Transport.stop()
}
