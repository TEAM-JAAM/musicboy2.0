import React, {useEffect, useRef} from 'react'
import {useCollection, useDocument} from 'react-firebase-hooks/firestore'
import {Spinner} from 'react-bootstrap'

import {Instrument} from '../../firestore/models'
import {SingleTimeslice} from '../timeslice/SingleTimeslice'
import Grid from './Grid'

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
        console.log(
          'calling use effect for instrument, instrument query result: ',
          instrumentQueryResult
        )
        const instrument = Instrument.fetchInstrumentData(instrumentQueryResult)
        grid.current.setKey(instrument.key)
        grid.current.setInstrument(instrument.name)
      }
    },
    [instrumentQueryResult]
  )

  // Collection of timeslices...
  const timeslicesCollectionRef = Instrument.findInstrumentTimeslicesQuery(
    docRef
  )
  const [
    timeslicesQueryResult,
    timeslicesLoading,
    timeslicesError
  ] = useCollection(timeslicesCollectionRef)
  const timeslicesDocRefs = Instrument.fetchTimesliceDocRefs(
    timeslicesQueryResult
  )

  // Each time the number of timeslices is increased, the sequences
  // grid must be informed
  useEffect(
    () => {
      if (timeslicesQueryResult) {
        grid.current.setupGrid(timeslicesQueryResult)
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
    return (
      <div>
        {timeslicesDocRefs.map(timesliceDocRef => {
          return (
            <SingleTimeslice
              key={timesliceDocRef.id}
              docRef={timesliceDocRef.ref}
              grid={grid.current}
            />
          )
        })}
      </div>
    )
  }
}
