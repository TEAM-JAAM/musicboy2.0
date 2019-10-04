import React from 'React'
import Tone from 'tone'
import {connect} from 'react-redux'
import {stopMusic, startMusic} from '../../instruments/utils'
import SingleInstrument from './SingleInstrument'

class AllInstruments extends React.Component {
  constructor() {
    super()
    this.state = {
      playing: false
    }
    this.synthSequence = []
    this.playHandler = this.playHandler.bind(this)
  }

  playHandler() {
    if (!this.state.playing) {
      this.setState({
        playing: true
      })
      startMusic()
    } else {
      this.setState({
        playing: false
      })
      stopMusic()
    }
  }
  render() {
    return (
      <div>
        <button className="play-btn" type="button" onClick={this.playHandler}>
          {!this.state.playing ? '▶️' : '| |'}
        </button>
        <SingleInstrument />
      </div>
    )
  }
}

export default connect()(AllInstruments)
