import React from 'react'
import Row from './Row'

const SingleInstrument = props => {
  const grid = props.grid
  return (
    <table className="instrument-container">
      <tbody>
        {grid.map(row => {
          return (
            <Row
              key={row[0].row}
              handleToggleCell={props.handleToggleCell}
              row={row}
            />
          )
        })}
      </tbody>
    </table>
  )
}

export default SingleInstrument
