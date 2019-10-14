import React, {useEffect, useRef} from 'react'
import {useCollection, useDocument} from 'react-firebase-hooks/firestore'
import {Spinner} from 'react-bootstrap'

import {Instrument} from '../../firestore/models'
import {SingleTimeslice} from '../timeslice/SingleTimeslice'
import {Grid} from '../../../utils'

export const SingleInstrumentTimeslices = ({docRef}) => {
  // grid containing the music sequences...
  const grid = useRef(null)
  useEffect(() => {
    grid.current = new Grid()
  }, [])

  // Instrument document...
  const [
    instrumentQueryResult,
    instrumentLoading,
    instrumentError
  ] = useDocument(docRef)

  // Each time the instrument key is updated, the sequences
  // grid must be informed...
  useEffect(
    () => {
      if (instrumentQueryResult) {
        const instrument = Instrument.fetchInstrumentData(instrumentQueryResult)
        grid.current.setKey(instrument.key)
        grid.current.setInstrument(instrument.name)
      }
    },
    [instrumentQueryResult]
  )

  function compareNumbers(a, b) {
    return a.id - b.id
  }

  // Collection of timeslices...
  const timeslicesCollectionRef = Instrument.findInstrumentTimeslicesQuery(
    docRef
  )
  const [
    timeslicesQueryResult,
    timeslicesLoading,
    timeslicesError
  ] = useCollection(timeslicesCollectionRef)
  let timeslicesDocRefs = Instrument.fetchTimesliceDocRefs(
    timeslicesQueryResult
  )

  // Each time the number of timeslices is changed, the sequences
  // grid must be informed
  useEffect(
    () => {
      if (timeslicesQueryResult) {
        const timeslices = timeslicesQueryResult.size
        const gridSize = grid.current.getGridSize()
        if (timeslices !== gridSize) {
          timeslicesDocRefs = Instrument.fetchTimesliceDocRefs(
            timeslicesQueryResult
          ).sort(compareNumbers)
          console.log(
            'our time slices docs before grid setup',
            timeslicesDocRefs
          )
          grid.current.setUpGrid(timeslicesDocRefs)
        }
      }
    },
    [timeslicesQueryResult]
  )

  if (timeslicesError || instrumentError) {
    throw new Error('FATAL: firestore error encountered')
  }
  if (timeslicesLoading || instrumentLoading) {
    return (
      <Spinner animation="border" role="status">
        <span className="align-self-center sr-only">Loading...</span>
      </Spinner>
    )
  }
  if (timeslicesQueryResult) {
    timeslicesDocRefs = Instrument.fetchTimesliceDocRefs(
      timeslicesQueryResult
    ).sort(compareNumbers)
    return (
      <div className="single-instrument-container">
        <table className="outer-table">
          <tbody>
            <tr className="table-body">
              {timeslicesDocRefs.map(timesliceDocRef => {
                //const highlightColumn = cell[1] ? 'on' : 'off'
                return (
                  <td
                    id={`column${timesliceDocRef.id}`}
                    key={timesliceDocRef.id}
                  >
                    <SingleTimeslice
                      docRef={timesliceDocRef.ref}
                      grid={grid.current}
                    />
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
