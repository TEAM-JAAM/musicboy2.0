import React from 'react'
import {SingleInstrumentDetails} from './SingleInstrumentDetails'
import {SingleInstrumentTimeslices} from './SingleInstrumentTimeslices'

export const SingleInstrument = ({docRef}) => {
  return (
    <React.Fragment>
      <div className="single-instrument-with-details">
        <SingleInstrumentDetails docRef={docRef} />
        <SingleInstrumentTimeslices docRef={docRef} />
      </div>
    </React.Fragment>
  )
}
