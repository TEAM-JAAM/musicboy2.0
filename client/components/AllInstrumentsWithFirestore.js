import React from 'react'
import {connect} from 'react-redux'
import {stopMusic, startMusic} from '../../utils'
import SingleInstrument from './SingleInstrumentWithFirestore'
import {Project} from '../firestore/models'

class AllInstruments extends React.Component {
  constructor() {
    super()
    this.state = {
      instrument: null,
      playing: false
    }
    this.instruments = []
    this.startOrStop = this.startOrStop.bind(this)
  }

  async componentDidMount() {
    // ...this component will require an open project. For now, assume that the
    // test project has been requested and is ready to be displayed...
    const project = await Project.findByPk('npcyFF33WB3T5vc8Le2b')
    if (!project) console.error('FATAL: failed to find test project')

    const instruments = await project.getInstruments()
    if (!instruments) console.error('FATAL: no instruments for this project')
    console.log('instruments: ', instruments[0].data())
    this.setState({
      instrument: instruments[0]
    })
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
        <SingleInstrument instrument={this.state.instrument} />
      </div>
    )
  }
}

export default connect()(AllInstruments)
