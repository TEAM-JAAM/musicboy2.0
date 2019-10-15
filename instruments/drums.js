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
const cymbal = new Tone.MetalSynth({
  frequency: 300,
  envelope: {
    attack: 0.001,
    decay: 0.1,
    release: 0.01
  },
  harmonicity: 0.1,
  modulationIndex: 0,
  resonance: 6000,
  octaves: 1.5
}).toMaster()

export {kick, clap, cymbal}
