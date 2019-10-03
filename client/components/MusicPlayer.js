import React from 'React'
import Tone from 'tone'
import {connect} from 'react-redux'
import {
  initRow,
  toggleCell,
  createSequence,
  stopMusic,
  startMusic
} from '../../instruments/utils'

class MusicPlayer extends React.Component {
  constructor() {
    super()
    this.state = {
      music: initRow(),
      update: true,
      playing: false
    }
    this.synthSequence = []
    this.handleCell = this.handleCell.bind(this)
    this.playHandler = this.playHandler.bind(this)
  }
  handleCell(cell) {
    toggleCell(cell)
    this.setState({
      update: !this.state.update
    })
    if (this.synthSequence.length) {
      this.synthSequence.cancel()
    }
    this.synthSequence = createSequence(this.state.music).start(0)
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
      console.log(this.state.playing)
      stopMusic()
    }
  }
  render() {
    const notes = this.state.music
    return (
      <div>
        {notes.map(note => {
          const statusColor = note.status ? 'on' : 'off'
          return (
            <div
              key={note.index}
              className={`cell ${statusColor}`}
              onClick={() => this.handleCell(note)}
            />
          )
        })}
        <button type="button" onClick={this.playHandler}>
          {!this.state.playing ? '▶️' : '| |'}
        </button>
      </div>
    )
  }
}

export default connect()(MusicPlayer)
