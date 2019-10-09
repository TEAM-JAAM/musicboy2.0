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
      instruments: []
    }
    this.startOrStop = this.startOrStop.bind(this)
    this.addRow = this.addRow.bind(this)
    this.removeRow = this.removeRow.bind(this)
  }

  async componentDidMount() {
    const project = await Project.findByPk('6USSWQf4AAKDvl6uWGhp')
    const instruments = await project.getInstruments()
    this.setState({
      instruments
    })
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

  addRow() {}

  removeRow() {}

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
          // disabled={this.state.grid[0].length <= 1}
          className="decrement-row-btn"
          type="button"
          onClick={this.removeRow}
        >
          remove column
        </button>
        <div className="scrolling-wrapper">
          <SingleInstrument instrument={this.state.instruments[0]} />
        </div>
      </div>
    )
  }
}

export default connect()(AllInstruments)
