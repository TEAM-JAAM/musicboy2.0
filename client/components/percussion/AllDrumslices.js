import React, {useEffect, useRef} from 'react'
import {useCollection, useDocument} from 'react-firebase-hooks/firestore'
import {Spinner} from 'react-bootstrap'
import {SingleDrumslice} from '../drumslice/SingleDrumslice'
import {Drums} from '../../firestore/models'
import {DrumGrid} from '../../../drumUtils'

const AllDrumslices = ({docRef}) => {
  const grid = useRef(null)
  useEffect(() => {
    grid.current = new DrumGrid()
  }, [])

  const [drumsQueryResult, drumsLoading, drumsError] = useDocument(docRef)

  const drumslicesCollectionRef = Drums.findDrumslicesQuery(docRef)

  const [
    drumslicesQueryResult,
    drumslicesLoading,
    drumslicesError
  ] = useCollection(drumslicesCollectionRef)
  let drumslicesDocRefs = Drums.fetchDrumsliceDocRefs(drumslicesQueryResult)

  useEffect(
    () => {
      if (drumslicesQueryResult) {
        const drumslices = drumslicesQueryResult.size
        const gridSize = grid.current.getGridSize()
        if (drumslices !== gridSize) {
          let sortedDocsArray = drumslicesQueryResult.docs.sort(function(a, b) {
            return a.id - b.id
          })
          grid.current.setUpGridFromSlices(sortedDocsArray)
        }
      }
    },
    [drumslicesQueryResult]
  )

  if (drumsError || drumslicesError)
    throw new Error('FATAL: firestore error encountered')
  if (drumsLoading || drumslicesLoading) {
    return (
      <Spinner animation="border" role="status">
        <span className="align-self-center sr-only">Loading...</span>
      </Spinner>
    )
  }

  if (drumsQueryResult) {
    drumslicesDocRefs.sort((a, b) => a.id - b.id)
    return (
      <div className="single-instrument-container outer-table">
        <table className="outer-table">
          <tbody>
            <tr className="table-body">
              {drumslicesDocRefs.map(drumsliceDocRef => {
                return (
                  <td
                    key={drumsliceDocRef.id}
                    id={`column${drumsliceDocRef.id}`}
                  >
                    <SingleDrumslice
                      docRef={drumsliceDocRef.ref}
                      grid={grid.current}
                    />
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default AllDrumslices
