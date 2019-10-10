import React from 'react'
import {useDocument} from 'react-firebase-hooks/firestore'
import Row from './Row'
import {Instrument} from '../firestore/models'
import {Grid} from '../../utils'

const SingleInstrument = props => {
  const instrumentDocRef = props.instrumentDocRef
  const [instrumentDocSnapshot, loading, error] = useDocument(instrumentDocRef)

  const timeslicesCollectionRef = Instrument.findAllTimeslices(instrumentDocRef)
  const [timeslicesQuerySnapshot, slicesLoading, slicesError] = useDocument(
    timeslicesCollectionRef
  )

  console.log(
    'this instrument data: ',
    instrumentDocSnapshot && instrumentDocSnapshot.data()
  )
  console.log(
    'timeslices: ',
    timeslicesQuerySnapshot &&
      timeslicesQuerySnapshot.docs.forEach((timeslice, index) => {
        console.log('timeslice[', index, ']: ', timeslice.data())
      })
  )

  const grid = props.grid
  return (
    <div>
      {loading && <p>Loading...</p>}
      {timeslicesQuerySnapshot && (
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
      )}
    </div>
  )
}

export default SingleInstrument
