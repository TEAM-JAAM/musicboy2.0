import React from 'react'
import Tone from 'tone'

const Row = props => {
  return (
    <tr className="instrument-row">
      {Object.values(props.row).map(node => {
        const cellClassName = node.status ? 'cell on' : 'cell off'
        return (
          <td
            key={node.index}
            className={cellClassName}
            onClick={() => props.handleToggleCell(node)}
          />
        )
      })}
    </tr>
  )
}

export default Row
