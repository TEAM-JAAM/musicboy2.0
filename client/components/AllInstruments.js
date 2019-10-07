import React from 'react'
import {connect} from 'react-redux'
import {
  stopMusic,
  startMusic,
  initGrid,
  toggleCell,
  createNewSequence,
  updateSequences,
  addRowToGrid,
  removeRowFromGrid
} from '../../utils'
import SingleInstrument from './SingleInstrument'
import Tone from 'tone'

class AllInstruments extends React.Component {
  constructor() {
    super()
    this.sequences = []
    this.state = {
      // tempo: 80,
      playing: false,
      grid: initGrid(8),
      update: true
    }
    this.handleToggleCell = this.handleToggleCell.bind(this)
    this.startOrStop = this.startOrStop.bind(this)
    this.addRow = this.addRow.bind(this)
    this.removeRow = this.removeRow.bind(this)
  }

  componentDidMount() {
    let grid = Object.values(this.state.grid)
    for (let i = 0; i < grid.length; ++i) {
      let nodesArray = Object.values(grid[i])
      this.sequences.push(createNewSequence(nodesArray))
    }
  }

  startOrStop() {
    if (!this.state.playing) {
      this.setState({playing: true})
      Tone.Transport.start()
    } else {
      this.setState({playing: false})
      Tone.Transport.stop()
    }
  }

  addRow() {
    const grid = this.state.grid
    this.setState({
      grid: addRowToGrid(grid)
    })
    // all sequences must be updated
    this.sequences = this.sequences.map((sequence, idx) => {
      sequence.cancel()
      return createNewSequence(grid[idx])
    })
  }

  removeRow() {
    const grid = this.state.grid
    this.setState({
      grid: removeRowFromGrid(grid)
    })
    this.sequences = this.sequences.map((sequence, idx) => {
      sequence.cancel()
      return createNewSequence(grid[idx])
    })
  }

  handleToggleCell(cell) {
    toggleCell(cell)
    const rowIdx = cell.row
    const grid = Object.values(this.state.grid)
    let timeSlice = grid.map(tSlice => {
      return tSlice[rowIdx]
    })
    this.sequences = updateSequences(this.sequences, timeSlice, rowIdx)
    this.setState({update: true})
  }

  render() {
    return (
      <div>
        <button className="play-btn" type="button" onClick={this.startOrStop}>
          {!this.state.playing ? '▶️' : '| |'}
        </button>
        <button
          className="increment-row-btn"
          type="button"
          onClick={this.addRow}
        >
          add column
        </button>
        <button
          disabled={this.state.grid[0].length <= 1}
          className="decrement-row-btn"
          type="button"
          onClick={this.removeRow}
        >
          remove column
        </button>
        <SingleInstrument
          handleToggleCell={this.handleToggleCell}
          grid={this.state.grid}
        />
      </div>
    )
  }
}

export default connect()(AllInstruments)
