import React from 'React'
import {connect} from 'react-redux'
import {
  stopMusic,
  startMusic,
  initGrid,
  AudioNode,
  toggleCell,
  createSequence
} from '../../utils'
import SingleInstrument from './SingleInstrument'

class AllInstruments extends React.Component {
  constructor() {
    super()
    this.sequences = {}
    this.state = {
      playing: false,
      grid: initGrid(12, 8)
    }
    this.startOrStop = this.startOrStop.bind(this)
    this.incrementRows = this.incrementRows.bind(this)
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
    if (Object.keys(this.sequences).length) {
      this.sequences.forEach(sequence => sequence.cancel())
    }
    this.sequences = this.state.grid.map(row => {
      return createSequence(row)
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
