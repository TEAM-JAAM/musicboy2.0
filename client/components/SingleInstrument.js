import React from 'react'
import {initGrid} from '../../utils'
import Row from './Row'

export default class SingleInstrument extends React.Component {
  constructor(props) {
    super(props)
    this.synthSequence = []
    this.state = {
      music: initGrid(12, 8)
    }
  }

  render() {
    const music = this.state.music
    return (
      <table className="instrument-container">
        <tbody>
          {music.map(row => {
            return <Row key={row[0].row} row={row} />
          })}
        </tbody>
      </table>
    )
  }
}
