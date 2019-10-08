import React, {useEffect, useState} from 'react'
import {useDocument} from 'react-firebase-hooks/firestore'
import {Project} from '../firestore/models'
import Row from './Row'

const SingleInstrument = props => {
  const instrument = props.instrument
  const [instrumentDocSnapshot, loading, error] = useDocument(
    instrument && instrument.ref()
  )

  const timeslices = instrument && instrument.ref().collection('timeslices')
  const [timeslicesQuerySnapshot, slicesLoading, slicesError] = useDocument(
    timeslices
  )

  console.log(
    'this instrument name: ',
    instrumentDocSnapshot && instrumentDocSnapshot.data()
  )
  console.log(
    'timeslices: ',
    timeslicesQuerySnapshot && timeslicesQuerySnapshot.docs
  )
  const grid = props.grid
  return (
    <div>
      {loading && <p>Loading...</p>}
      {instrumentDocSnapshot &&
        timeslicesQuerySnapshot && (
          <table className="instrument-container">
            <tbody className="table-body">
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
        )}
    </div>
  )
}

export default SingleInstrument
