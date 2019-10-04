import Tone from 'tone'

const synth = new Tone.PolySynth({
  polyphony: 12,
  voice: Tone.Synth
}).toMaster()

export default synth
