import Tone from 'tone'

const kick = new Tone.MembraneSynth().toMaster()
const clap = new Tone.NoiseSynth().toMaster()

export {kick, clap}
