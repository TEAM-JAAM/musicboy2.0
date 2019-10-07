import React from 'react'
import Tone from 'tone'

const Row = props => {
  const curser = Tone.Transport.position.split(':')[1]
  Tone.Transport.schedule(function(time) {
    Tone.Draw.schedule(function() {
      console.log(curser)
    }, time)
  })
  return (
    <tr className="instrument-row">
      {props.row.map(node => {
        const cellClassName = node.status
          ? `cell on ${curser}`
          : `cell off ${curser}`
        // const statusColor = node.status ? 'cell on' : 'cell off';
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
