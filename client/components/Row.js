import React from 'react'
import {toggleCell, createSequence} from '../../utils'

class Row extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sequence: {}
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(cell) {
    toggleCell(cell)
    if (Object.keys(this.state.sequence).length) {
      this.state.sequence.cancel()
    }

    this.setState({sequence: createSequence(this.props.row)})
    // this.props.synthSequence.push(createSequence(cell))
    // console.log('SEQUENCE ARR', this.props.synthSequence)
    // // let temp = [this.state.sequence]
    // // temp.push(createSequence(cell))
    // this.setState({sequence: {}})
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
