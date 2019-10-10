class Grid {
  constructor() {
    this.key = ''
    this.instrument = ''
    console.log('INSTRUMENT: created instrument')
  }

  setupGrid = timesliceDocs => {
    console.log(
      'INSTRUMENT: setting the number of slices to: ',
      timesliceDocs.size
    )
  }

  setKey = key => {
    this.key = key
    console.log('INSTRUMENT: trying to set the key to: ', key)
  }

  setInstrument = instrument => {
    this.instrument = instrument
  }

  updateSlice = (col, value) => {
    console.log('INSTRUMENT: changing the value of: ', col, ' to ', value)
  }

  playCell = (row, col) => {
    console.log('INSTRUMENT: playing the cell at: (', row, ',', col, ')')
    console.log('BEEP')
  }
}

export default Grid
