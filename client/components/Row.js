import React from 'react'
import Tone from 'tone'

const Row = props => {
  return (
    <div className="time-slice">
      {Object.values(props.row).map(node => {
        const cellClassName = node.status ? 'cell on' : 'cell off'
        return (
          <div
            key={node.index}
            className={cellClassName}
            onClick={() => props.handleToggleCell(node)}
          />
        )
      })}
    </div>
  )
}

export default Row
