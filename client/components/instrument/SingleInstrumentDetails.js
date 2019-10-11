import React from 'react'
import {useDocument} from 'react-firebase-hooks/firestore'
import {Spinner} from 'react-bootstrap'
import {Instrument} from '../../firestore/models'

export const SingleInstrumentDetails = ({docRef}) => {
  const [instrumentQueryResult, loading, error] = useDocument(docRef)
  const instrument = Instrument.fetchInstrumentData(instrumentQueryResult)

  function handleChange(event) {
    Instrument.update(
      instrumentQueryResult,
      `${event.target.name}`,
      event.target.value
    )
  }

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
      <div className="single-instrument-options">
        <h2>{instrument.name}</h2>
        <div className="select-instrument-name">
          <label htmlFor="name">select instrument</label>
          <select onChange={handleChange} name="name">
            <option value="" selected disabled hidden>
              {instrument.name}
            </option>
            <option value="synth">synth</option>
            <option value="steelPan">steel pan</option>
            <option value="electricCello">electric cello</option>
          </select>
        </div>
        <div className="select-instrument-key">
          <label htmlFor="key">change key</label>
          <select onChange={handleChange} name="key">
            <option value="" selected disabled hidden>
              {instrument.key}
            </option>
            <option value="G_MAJOR">major</option>
            <option value="G_MINOR">minor</option>
            <option value="PENTATONIC">pentatonic</option>
          </select>
        </div>
      </div>
    )
  }
}
