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

  const grid =
    timeslicesQuerySnapshot && Object.values(timeslicesQuerySnapshot.docs)
  let sequences =
    grid &&
    grid.reduce((accum, querySnapshot) => {
      accum.push(querySnapshot.data())
      return accum
    }, [])
  console.log('grid ... ', sequences)
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
