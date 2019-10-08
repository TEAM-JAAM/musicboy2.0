import React, {useEffect, useState} from 'react'
import {useDocument} from 'react-firebase-hooks/firestore'
import {Project} from '../firestore/models'
import Timeslice from './Timeslice'

const SingleInstrument = props => {
  const instrument = props.instrument
  const [instrumentDocSnapshot, loading, error] = useDocument(
    instrument && instrument.ref()
  )

  const timeslices = instrument && instrument.ref().collection('timeslices')
  const [timeslicesQuerySnapshot, slicesLoading, slicesError] = useDocument(
    timeslices
  )

  // timeslicesQuerySnapshot.docs.map((timeSlice) => {
  // 	// console.log('timeSlice...', timeSlice.data());
  // });
  // console.log(timeslicesQuerySnapshot.docs, timeslicesQuerySnapshot.docs[0].data());

  // console.log('timeslices: ', timeslicesQuerySnapshot && timeslicesQuerySnapshot.docs[1].data());
  // console.log('timeslices length: ', timeslicesQuerySnapshot && timeslicesQuerySnapshot.docs.length);

  // const grid = props.grid;
  const grid =
    timeslicesQuerySnapshot && Object.values(timeslicesQuerySnapshot.docs)
  return (
    <div className="instrument-container">
      {grid ? (
        grid.map((slice, idx) => {
          // slice = Object.values(slice.data());
          return <Timeslice key={idx} sliceIndex={idx} slice={slice} />
        })
      ) : (
        <h1>loading...</h1>
      )}
    </div>
  )
}

export default SingleInstrument
