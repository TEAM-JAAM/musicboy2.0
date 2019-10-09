import React from 'react'
import {useCollection} from 'react-firebase-hooks/firestore'
import {Spinner} from 'react-bootstrap'

import {Project} from '../../firestore/models'
import {SingleInstrument} from '../instrument/SingleInstrument'

export const SingleProjectInstruments = ({docRef}) => {
  const instrumentsCollectionRef = Project.findProjectInstrumentsQuery(docRef)
  const [instrumentQueryResult, loading, error] = useCollection(
    instrumentsCollectionRef
  )
  const instrumentDocRefs = Project.fetchInstrumentDocRefs(
    instrumentQueryResult
  )

  if (error) throw new Error('FATAL: firestore error encountered')
  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="align-self-center sr-only">Loading...</span>
      </Spinner>
    )
  }
  if (instrumentQueryResult) {
    return (
      <div>
        {instrumentDocRefs.map(instrumentDocRef => {
          return (
            <SingleInstrument
              key={instrumentDocRef.id}
              docRef={instrumentDocRef.ref}
            />
          )
        })}
      </div>
    )
  }
}
