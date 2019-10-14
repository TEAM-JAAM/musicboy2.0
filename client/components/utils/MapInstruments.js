const instrumentNameMap = {
  bassGuitar: {name: 'Bass Guitar', image: '/images/guitar.svg'},
  electric: {name: 'Electric', image: '/images/guitar.svg'},
  electricCello: {name: 'Electric Cello', image: '/images/guitar.svg'},
  kalimba: {name: 'Kalimba', image: '/images/keyboard.svg'},
  marimba: {name: 'Marimba', image: '/images/keyboard.svg'},
  pianoetta: {name: 'Pianoetta', image: '/images/keyboard.svg'},
  steelPan: {name: 'Steel Pan', image: '/images/keyboard.svg'},
  synth: {name: 'Synthesizer', image: '/images/keyboard.svg'},
  tiny: {name: 'Tiny', image: '/images/keyboard.svg'}
}

export const mapInstrumentName = instrumentName => {
  return instrumentNameMap[instrumentName].name || 'Mystery'
}

export const mapInstrumentImage = instrumentName => {
  return instrumentNameMap[instrumentName].image || '/images/keyboard.svg'
}

export const getInstrumentKeysAndNames = () => {
  return Object.keys(instrumentNameMap).map(instrumentKey => ({
    key: instrumentKey,
    name: instrumentNameMap[instrumentKey].name
  }))
}
