import React from 'react'
import {SingleInstrumentDetails} from './SingleInstrumentDetails'
import {SingleInstrumentTimeslices} from './SingleInstrumentTimeslices'
import {Button} from 'react-bootstrap'
import Tone from 'tone'

export const SingleInstrument = ({docRef}) => {
  return (
    <React.Fragment>
      <div className="single-instrument-with-details">
        <SingleInstrumentDetails docRef={docRef} />
        <SingleInstrumentTimeslices docRef={docRef} />
      </div>
      <br />
      <Button
        variant="success"
        onClick={() => {
          Tone.Transport.start()
        }}
      >
        Play
      </Button>
      <Button
        variant="warning"
        onClick={() => {
          Tone.Transport.stop()
        }}
      >
        Stop
      </Button>
    </React.Fragment>
  )
}
