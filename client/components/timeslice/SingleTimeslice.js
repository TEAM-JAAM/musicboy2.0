import React, {useEffect, useRef} from 'react'
import {useDocument} from 'react-firebase-hooks/firestore'
import {Button, Spinner} from 'react-bootstrap'

import {Timeslice} from '../../firestore/models'

export const SingleTimeslice = ({docRef, grid}) => {
  const instrumentGrid = useRef(grid)
  const [timesliceQueryResult, loading, error] = useDocument(docRef)
  const timesliceIndex = Timeslice.fetchTimesliceIndex(timesliceQueryResult)
  const timeslice = Timeslice.fetchTimesliceData(timesliceQueryResult)

  useEffect(
    () => {
      if (timesliceQueryResult) {
        const updatedTimeslice = timesliceQueryResult.data()
        console.log('timeslice: got a change: ', updatedTimeslice)
        instrumentGrid.current.updateSlice(timesliceIndex, updatedTimeslice)
      }
    },
    [timesliceQueryResult]
  )

  const handleClick = async row => {
    console.log('clicked index: ', row, ', typeof row: ', typeof row)
    console.log('row in local store: ', timeslice[row].toString())
    const newCellRow = !timeslice[row]
    await Timeslice.update(timesliceQueryResult, row, newCellRow)

    if (newCellRow === true) {
      instrumentGrid.current.playCell(row, timesliceIndex)
    }
  }

  if (error) throw new Error('FATAL: firestore error encountered')
  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="align-self-center sr-only">Loading...</span>
      </Spinner>
    )
  }
  if (timesliceQueryResult) {
    let timesliceArr = Object.entries(timeslice)

    return timesliceArr.map(cell => {
      const statusColor = cell[1] ? 'cell on' : 'cell off'
      return (
        <div
          key={cell}
          className={statusColor}
          onClick={() => {
            handleClick(cell[0])
          }}
        />
      )
    })

    // <div>
    //   <h1>Single Timeslice Details for {timesliceIndex}</h1>
    //   <Button onClick={() => handleClick(0)} variant="primary" name="0">
    //     timeslice.0
    //   </Button>
    //   <Button onClick={() => handleClick(1)} variant="primary" name="1">
    //     timeslice.1
    //   </Button>
    //   <Button onClick={() => handleClick(2)} variant="primary" name="2">
    //     timeslice.2
    //   </Button>
    //   <Button onClick={() => handleClick(3)} variant="primary" name="3">
    //     timeslice.3
    //   </Button>
    //   <Button onClick={() => handleClick(4)} variant="primary" name="4">
    //     timeslice.4
    //   </Button>
    //   <Button onClick={() => handleClick(5)} variant="primary" name="5">
    //     timeslice.5
    //   </Button>
    //   <Button onClick={() => handleClick(6)} variant="primary" name="6">
    //     timeslice.6
    //   </Button>
    //   <Button onClick={() => handleClick(7)} variant="primary" name="7">
    //     timeslice.7
    //   </Button>
    //   <Button onClick={() => handleClick(8)} variant="primary" name="8">
    //     timeslice.8
    //   </Button>
    //   <Button onClick={() => handleClick(9)} variant="primary" name="9">
    //     timeslice.9
    //   </Button>
    //   <Button onClick={() => handleClick(10)} variant="primary" name="10">
    //     timeslice.10
    //   </Button>
    //   <Button onClick={() => handleClick(11)} variant="primary" name="11">
    //     timeslice.11
    //   </Button>
    // </div>
  }
}
