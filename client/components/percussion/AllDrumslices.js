import React from 'react'
import {useCollection, useDocument} from 'react-firebase-hooks/firestore'
import {Spinner} from 'react-bootstrap'
import {Drums} from '../../firestore/models'

const AllDrumslices = ({docRef}) => {
  const [drumsQueryResult, loading, error] = useDocument(docRef)
  const drumsData = Drums.fetchDrumsData(drumsQueryResult)

  if (error) throw new Error('FATAL: firestore error encountered')
  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="align-self-center sr-only">Loading...</span>
      </Spinner>
    )
  }
  if (drumsQueryResult) {
    return <div>AllDrumSlices, baby</div>
  } else {
    return <div>No drums query result</div>
  }
}

export default AllDrumslices
