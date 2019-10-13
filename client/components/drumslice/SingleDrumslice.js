import React, {useEffect, useRef} from 'react'
import {useDocument} from 'react-firebase-hooks/firestore'
import {Spinner} from 'react-bootstrap'
import {Drumslice} from '../../firestore/models'

export const SingleDrumslice = ({docRef}) => {
  const [drumsliceQueryResult, loading, error] = useDocument(docRef)

  // const drumsliceIndex = Drumslice.fetchDrumsliceIndex(drumsliceQueryResult);
  const drumslice = Drumslice.fetchDrumsliceData(drumsliceQueryResult)

  if (error) throw new Error('FATAL: firestore error encountered')
  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="align-self-center sr-only">Loading...</span>
      </Spinner>
    )
  }
  if (drumsliceQueryResult) {
    const cells = Object.keys(drumslice)
    return (
      <div className="single-drumslice-container">
        {cells.map(cell => {
          console.log('cell...', cell)
          const statusColor = cell.value ? 'cell on' : 'cell off'
          return <div key={cell} className={`${statusColor} drum-cell`} />
        })}
      </div>
    )
  } else {
    return <div>no drumslice query result</div>
  }
}
