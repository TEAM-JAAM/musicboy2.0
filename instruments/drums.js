import Tone from 'tone'

const kick = new Tone.MembraneSynth().toMaster()
const clap = new Tone.NoiseSynth({
  noise: {
    type: 'white',
    spread: 50,
    density: 80,
    surface: 12,
    frequency: 40
  },
  envelope: {
    attack: 0.005,
    decay: 0.33,
    sustain: 0
  }
}).toMaster()

export {kick, clap}
