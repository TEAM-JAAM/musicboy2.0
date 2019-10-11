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
        instrumentGrid.current.updateSlice(timesliceIndex, updatedTimeslice)
      }
    },
    [timesliceQueryResult]
  )

  const handleClick = async row => {
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
    return (
      <table>
        {timesliceArr.map(cell => {
          const statusColor = cell[1] ? 'cell on' : 'cell off'
          return (
            <tr key={cell}>
              <td
                className={statusColor}
                onClick={() => {
                  handleClick(cell[0])
                }}
              />
            </tr>
          )
        })}
      </table>
    )
  }
}
