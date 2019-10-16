const instrumentNameMap = {
  electricCello: {name: 'Cello', image: '/images/cello.svg'},
  marimba: {name: 'Electric Guitar', image: '/images/guitar.svg'},
  steelPan: {name: 'Steel Pan', image: '/images/keyboard.svg'},
  synth: {name: 'Synthesizer', image: '/images/keyboard.svg'}
}

export const mapInstrumentName = instrumentName => {
  return instrumentNameMap[instrumentName].name || 'Mystery'
}

export const mapInstrumentImage = instrumentName => {
  return instrumentNameMap[instrumentName].image || '/images/keyboard.svg'
}

export const getInstrumentKeysAndNames = (excludedInstruments = []) => {
  return Object.keys(instrumentNameMap)
    .filter(instrumentKey => !excludedInstruments.includes(instrumentKey))
    .map(instrumentKey => ({
      key: instrumentKey,
      name: instrumentNameMap[instrumentKey].name
    }))
}
