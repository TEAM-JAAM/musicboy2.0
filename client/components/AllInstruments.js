import React from 'React'
import {connect} from 'react-redux'
import {
  stopMusic,
  startMusic,
  initGrid,
  AudioNode,
  toggleCell,
  createNewSequence
} from '../../utils'
import SingleInstrument from './SingleInstrument'

class AllInstruments extends React.Component {
  constructor() {
    super()
    this.sequences = []
    this.state = {
      playing: false,
      grid: initGrid(12, 8)
      // update: true
    }
    this.handleClick = this.handleClick.bind(this)
    this.startOrStop = this.startOrStop.bind(this)
    this.incrementRows = this.incrementRows.bind(this)
  }

  componentDidMount() {
    let grid = this.state.grid
    for (let i = 0; i < grid.length; ++i) {
      this.sequences.push(createNewSequence(grid[i]))
    }
    console.log(this.sequences)
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

  incrementRows() {
    const grid = this.state.grid
    this.setState({
      grid: grid.map((row, idx) => {
        let pitch = row[0].pitch
        let node = new AudioNode(idx, row.length, pitch)
        row.push(node)
        return row
      })
    })
    this.sequences = this.sequences.map((sequence, idx) => {
      sequence.cancel()
      return createNewSequence(grid[idx])
    })
  }

  handleClick(cell) {
    toggleCell(cell)
    const grid = this.state.grid
    const rowIdx = cell.row
    const row = this.state.grid[rowIdx]
    this.sequences = this.sequences.map((sequence, idx) => {
      if (idx === rowIdx) {
        sequence.cancel()
        return createNewSequence(row)
      } else {
        return sequence
      }
    })
    this.setState({
      grid: grid
    })
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
          onClick={this.incrementRows}
        >
          add rows
        </button>
        <SingleInstrument
          handleClick={this.handleClick}
          grid={this.state.grid}
        />
      </div>
    )
  }
}

export default connect()(AllInstruments)
