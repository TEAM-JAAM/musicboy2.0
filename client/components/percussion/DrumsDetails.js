import React from 'react'
import {useDocument} from 'react-firebase-hooks/firestore'
import {Spinner} from 'react-bootstrap'

const DrumsDetails = ({docRef}) => {
  const [drumsQueryResult, loading, error] = useDocument(docRef)

  if (error) throw new Error('FATAL: firestore error encountered')
  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="align-self-center sr-only">Loading...</span>
      </Spinner>
    )
  }
  if (drumsQueryResult) {
    return <h1>🥁</h1>
  } else {
    return <div>NO DRUMS QUERY RESULT</div>
  }
}

export default DrumsDetails
