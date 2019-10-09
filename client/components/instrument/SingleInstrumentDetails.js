import React from 'react'
import {useDocument} from 'react-firebase-hooks/firestore'
import {Spinner} from 'react-bootstrap'

import {Instrument} from '../../firestore/models'

export const SingleInstrumentDetails = ({docRef}) => {
  const [instrumentQueryResult, loading, error] = useDocument(docRef)
  const instrument = Instrument.fetchInstrumentData(instrumentQueryResult)

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
        <h1>Single Instrument</h1>
        <p>instrument.name: {instrument.name}</p>
        <p>instrument.key: {instrument.key}</p>
      </div>
    )
  }
}
