import React from 'react'
import {initGrid} from '../../utils'
import Row from './Row'

export default class SingleInstrument extends React.Component {
  constructor(props) {
    super(props)
    this.synthSequence = []

    this.state = {
      music: initGrid(8)
    }
  }

  render() {
    const music = this.state.music
    console.log('SINGLE INSTRUMENT', music)
    return (
      <table className="instrument-container">
        <tbody>
          {music.map(row => {
            return (
              <Row
                key={row.index}
                row={row}
                synthSequence={this.synthSequence}
              />
            )
          })}
        </tbody>
      </table>
    )
  }
}
