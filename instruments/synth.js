import Tone from 'tone'

// const friend = new Tone.Synth({
// 	oscillator: {
// 		type: 'triangle'
// 	},
// 	envelope: {
// 		attack: 0.005,
// 		decay: 0.1,
// 		sustain: 0.3,
// 		release: 1
// 	}
// });

const synth = new Tone.PolySynth(12, Tone.Synth, {
  oscillator: {
    type: 'sawtooth'
  },
  envelope: {
    attack: 0.005,
    decay: 0.1,
    sustain: 0.3,
    release: 1
  }
}).toMaster()

export default synth
