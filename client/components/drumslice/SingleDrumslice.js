import React, {useEffect, useRef} from 'react'
import {useDocument} from 'react-firebase-hooks/firestore'
import {Spinner} from 'react-bootstrap'
import {Drumslice} from '../../firestore/models'

export const SingleDrumslice = ({docRef, grid}) => {
  const drumGrid = useRef(grid)
  const [drumsliceQueryResult, loading, error] = useDocument(docRef)

  const drumsliceIndex = Drumslice.fetchDrumsliceIndex(drumsliceQueryResult)
  const drumslice = Drumslice.fetchDrumsliceData(drumsliceQueryResult)

  useEffect(
    () => {
      if (drumsliceQueryResult) {
        console.log('TRYING TO UPDATE DRUMSLICE')
        const updatedDrumslice = drumsliceQueryResult.data()
        drumGrid.current.updateSlice(drumsliceIndex, updatedDrumslice)
      }
    },
    [drumsliceQueryResult]
  )

  async function handleClick(cellRowIndex) {
    const newCellStatus = !drumslice[cellRowIndex]
    await Drumslice.update(drumsliceQueryResult, cellRowIndex, newCellStatus)
    if (newCellStatus === true) {
      drumGrid.current.playCell(cellRowIndex, drumsliceIndex)
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
  if (drumsliceQueryResult) {
    const cells = Object.keys(drumslice)
    return (
      <table>
        <tbody>
          {cells.map(cell => {
            const statusColor = drumslice[cell] ? 'cell on' : 'cell off'
            return (
              <tr key={cell}>
                <td
                  key={cell}
                  className={statusColor}
                  onClick={() => {
                    handleClick(cell)
                  }}
                />
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}
