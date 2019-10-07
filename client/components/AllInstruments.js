import React from 'react'
import {connect} from 'react-redux'
import {stopMusic, startMusic} from '../../utils'
import SingleInstrument from './SingleInstrument'

class AllInstruments extends React.Component {
  constructor() {
    super()
    this.state = {
      playing: false
    }
    this.startOrStop = this.startOrStop.bind(this)
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
  render() {
    return (
      <div>
        <button className="play-btn" type="button" onClick={this.startOrStop}>
          {!this.state.playing ? '▶️' : '| |'}
        </button>
        <SingleInstrument />
      </div>
    )
  }
}

export default connect()(AllInstruments)
