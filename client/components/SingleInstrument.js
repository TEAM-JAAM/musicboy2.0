import React from 'react'
import Row from './Row'

const SingleInstrument = props => {
  const grid = props.grid
  return (
    <div className="instrument-container">
      {Object.values(grid).map(row => {
        return (
          <Row
            key={row[0].row}
            handleToggleCell={props.handleToggleCell}
            row={row}
          />
        )
      })}
    </div>
  )
}

export default SingleInstrument
