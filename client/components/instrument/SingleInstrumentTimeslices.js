import React from 'react'
import {useCollection} from 'react-firebase-hooks/firestore'
import {Spinner} from 'react-bootstrap'

import {Instrument} from '../../firestore/models'
import {SingleTimeslice} from '../timeslice/SingleTimeslice'

export const SingleInstrumentTimeslices = ({docRef}) => {
  const timeslicesCollectionRef = Instrument.findInstrumentTimeslicesQuery(
    docRef
  )
  const [timeslicesQueryResult, loading, error] = useCollection(
    timeslicesCollectionRef
  )
  const timeslicesDocRefs = Instrument.fetchTimesliceDocRefs(
    timeslicesQueryResult
  )

  if (error) throw new Error('FATAL: firestore error encountered')
  if (loading) {
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
            />
          )
        })}
      </div>
    )
  }
}
