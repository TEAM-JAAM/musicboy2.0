import React from 'react'
import {initGrid, toggleCell, createSequence} from '../../instruments/utils'

function Row(props) {
  return (
    <tr className="instrument-row">
      {props.sequence.map(node => {
        const statusColor = node.status ? 'cell on' : 'cell off'
        return (
          <td
            key={node.index}
            className={statusColor}
            onClick={() => props.handleCell}
          />
        )
      })}
    </tr>
  )
}

export default class SingleInstrument extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      music: initGrid(12, 8),
      update: true
    }
    this.handleCell = this.handleCell.bind(this)
  }
  handleCell(cell) {
    toggleCell(cell)
    this.setState({update: !this.state.update})
    if (this.synthSequence.length) {
      this.synthSequence.cancel()
    }
    this.synthSequence = createSequence(this.state.music).start(0)
  }

  render() {
    const music = this.state.music
    console.log('music...', music)
    return (
      <table className="instrument-container">
        <tbody>
          {music.map(row => {
            return (
              <Row
                key={row[0].row}
                sequence={row}
                handleCell={this.handleCell}
              />
            )
          })}
        </tbody>
      </table>
    )
  }
}
