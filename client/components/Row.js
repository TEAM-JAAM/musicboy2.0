import React from 'react'
import {toggleCell, createSequence} from '../../utils'

class Row extends React.Component {
  constructor() {
    super()
    this.state = {
      sequence: {}
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(cell) {
    toggleCell(cell)
    if (Object.keys(this.state.sequence).length) this.state.sequence.cancel()
    const row = this.props.row
    this.setState({sequence: createSequence(row)})
  }

  render() {
    return (
      <tr className="instrument-row">
        {this.props.row.map(node => {
          const statusColor = node.status ? 'cell on' : 'cell off'
          return (
            <td
              key={node.index}
              className={statusColor}
              onClick={() => this.handleClick(node)}
            />
          )
        })}
      </tr>
    )
  }
}

export default Row
