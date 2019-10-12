import Tone from 'tone'

const synth = new Tone.PolySynth(12, Tone.Synth, {
  oscillator: {
    type: 'triangle'
  },
  envelope: {
    attack: 0.005,
    decay: 0.1,
    sustain: 0.3,
    release: 1
  }
}).toMaster()

const electricCello = new Tone.PolySynth(12, Tone.FMSynth, {
  harmonicity: 3.01,
  modulationIndex: 14,
  oscillator: {
    type: 'triangle'
  },
  envelope: {
    attack: 0.02,
    decay: 0.3,
    sustain: 0.1,
    release: 1.2
  },
  modulation: {
    type: 'square'
  },
  modulationEnvelope: {
    attack: 0.01,
    decay: 0.5,
    sustain: 0.2,
    release: 0.1
  }
}).toMaster()

const steelPan = new Tone.PolySynth(12, Tone.Synth, {
  oscillator: {
    type: 'fatcustom',
    partials: [0.2, 1, 0, 0.5, 0.1],
    spread: 40,
    count: 3
  },
  envelope: {
    attack: 0.01,
    decay: 1.6,
    sustain: 0,
    release: 1.6
  }
}).toMaster()

const marimba = new Tone.PolySynth(12, Tone.Synth, {
  oscillator: {
    type: 'sawtooth'
  },
  envelope: {
    attack: 0.001,
    decay: 1.2,
    sustain: 0,
    release: 1.2
  }
}).toMaster()

const bassGuitar = new Tone.PolySynth(12, Tone.MonoSynth, {
  oscillator: {
    type: 'fmsquare5',
    modulationType: 'triangle',
    modulationIndex: 2,
    harmonicity: 0.501
  },
  filter: {
    Q: 1,
    type: 'lowpass',
    rolloff: -24
  },
  envelope: {
    attack: 0.01,
    decay: 0.1,
    sustain: 0.4,
    release: 2
  },
  filterEnvelope: {
    attack: 0.01,
    decay: 0.1,
    sustain: 0.8,
    release: 1.5,
    baseFrequency: 50,
    octaves: 4.4
  }
})

const pianoetta = new Tone.PolySynth(12, Tone.MonoSynth, {
  oscillator: {
    type: 'square'
  },
  filter: {
    Q: 2,
    type: 'lowpass',
    rolloff: -12
  },
  envelope: {
    attack: 0.005,
    decay: 3,
    sustain: 0,
    release: 0.45
  },
  filterEnvelope: {
    attack: 0.001,
    decay: 0.32,
    sustain: 0.9,
    release: 3,
    baseFrequency: 700,
    octaves: 2.3
  }
})

export {synth, electricCello, steelPan, marimba, bassGuitar, pianoetta}
