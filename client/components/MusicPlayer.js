import React from 'React'
import Tone from 'tone'
import {connect} from 'react-redux'
import {
  initRow,
  toggleCell,
  playMusic,
  stopMusic
} from '../../instruments/utils'

class MusicPlayer extends React.Component {
  constructor() {
    super()
    this.state = {
      music: initRow(),
      update: true,
      playing: false
    }
    this.handleCell = this.handleCell.bind(this)
    this.playHandler = this.playHandler.bind(this)
  }
  handleCell(cell) {
    toggleCell(cell)
    this.setState({
      update: !this.state.update
    })
  }
  playHandler() {
    if (!this.state.playing) {
      this.setState({
        playing: true
      })
      return playMusic(this.state.music)
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
