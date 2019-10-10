import React from 'react'
import {useDocument} from 'react-firebase-hooks/firestore'
import {Spinner} from 'react-bootstrap'
import {Instrument} from '../../firestore/models'
// import {
// 	synth,
// 	tiny,
// 	kalimba,
// 	electricCello,
// 	steelPan,
// 	marimba,
// 	electric,
// 	bassGuitar,
// 	pianoetta,
// 	G_MAJOR,
// 	G_MINOR,
// 	PENTATONIC
// } from '../../instruments';

export const SingleInstrumentDetails = ({docRef}) => {
  const [instrumentQueryResult, loading, error] = useDocument(docRef)
  const instrument = Instrument.fetchInstrumentData(instrumentQueryResult)

  function handleChange(event) {
    Instrument.update(instrumentQueryResult, 'name', event.target.value)
    // console.log('insrument', instrument);
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
        <h1>{instrument.name}</h1>
        <label htmlFor="select-instrument">select instrument</label>
        <select
          onChange={handleChange}
          name="select-instrument"
          className="select-instrument-type"
        >
          <option value="synth">synth</option>
          <option value="steelPan">steelPan</option>
          <option value="electric">electric</option>
        </select>
        <p>instrument.key: {instrument.key}</p>
      </div>
    )
  }
}
