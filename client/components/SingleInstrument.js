import React, {useEffect, useState} from 'react'
import {useDocument} from 'react-firebase-hooks/firestore'
import {Project} from '../firestore/models'
import Timeslice from './Timeslice'
import {toggleCell, updateSequence} from '../../utils'

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

  const sequences = {}

  const allNodes = {}

  function handleToggleCell(cell) {
    toggleCell(cell)
    const rowOfNodes = allNodes[cell.row]
    if (sequences[cell.row]) sequences[cell.row].cancel()
    sequences[cell.row] = updateSequence(rowOfNodes, cell)
  }

  return (
    <div className="instrument-container">
      {grid ? (
        grid.map((querySnapshot, idx) => {
          return (
            <Timeslice
              key={idx}
              handleToggleCell={handleToggleCell}
              sliceIndex={idx}
              allNodes={allNodes}
              slice={querySnapshot}
            />
          )
        })
      ) : (
        <h1>loading...</h1>
      )}
    </div>
  )
}

export default SingleInstrument
