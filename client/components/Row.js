import React from 'react'

const Row = props => {
  return (
    <tr className="instrument-row">
      {props.row.map(node => {
        const statusColor = node.status ? 'cell on' : 'cell off'
        return (
          <td
            key={node.index}
            className={statusColor}
            onClick={() => props.handleToggleCell(node)}
          />
        )
      })}
    </tr>
  )
}

export default Row
