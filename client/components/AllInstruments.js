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
import {Project} from '../firestore/models'

class AllInstruments extends React.Component {
  constructor() {
    super()
    this.sequences = []
    this.state = {
      // tempo: 80,
      playing: false,
      grid: initGrid(12, 8),
      update: true,
      instruments: []
    }
    this.handleToggleCell = this.handleToggleCell.bind(this)
    this.startOrStop = this.startOrStop.bind(this)
    this.addRow = this.addRow.bind(this)
    this.removeRow = this.removeRow.bind(this)
  }

  async componentDidMount() {
    let grid = this.state.grid
    for (let i = 0; i < grid.length; ++i) {
      this.sequences.push(createNewSequence(grid[i]))
    }

    const project = await Project.findByPk('MBM6lV5hqPCIcIcP6ucG')
    const instruments = await project.getInstruments()
    console.log('instruments[0]: ', instruments[0].data())
    this.setState({
      instruments
    })
  }

  startOrStop() {
    if (!this.state.playing) {
      const curser = Tone.Transport.position
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
          instrument={this.state.instruments[0]}
        />
      </div>
    )
  }
}

export default connect()(AllInstruments)
