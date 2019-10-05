import React from 'React'
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

class AllInstruments extends React.Component {
  constructor() {
    super()
    this.sequences = []
    this.state = {
      playing: false,
      grid: initGrid(12, 8),
      update: true
    }
    this.handleToggleCell = this.handleToggleCell.bind(this)
    this.startOrStop = this.startOrStop.bind(this)
    this.addRow = this.addRow.bind(this)
    this.removeRow = this.removeRow.bind(this)
  }

  componentDidMount() {
    let grid = this.state.grid
    for (let i = 0; i < grid.length; ++i) {
      this.sequences.push(createNewSequence(grid[i]))
    }
  }

  startOrStop() {
    if (!this.state.playing) {
      this.setState({playing: true})
      startMusic()
    } else {
      this.setState({playing: false})
      stopMusic()
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
    const row = this.state.grid[rowIdx]
    this.sequences = updateSequences(this.sequences, row, rowIdx)
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
          add rows
        </button>
        <button
          className="decrement-row-btn"
          type="button"
          onClick={this.removeRow}
        >
          remove rows
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
