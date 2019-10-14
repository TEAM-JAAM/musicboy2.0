import React from 'react'
import {useDocument} from 'react-firebase-hooks/firestore'
import {Spinner, Button} from 'react-bootstrap'
import {Drums} from '../../firestore/models'

const DrumsDetails = ({docRef}) => {
  const [drumsQueryResult, loading, error] = useDocument(docRef)
  // const drumsData = Drums.fetchDrumsData(drumsQueryResult);

  async function handleClear() {
    const drums = Drums.fromDocRef(drumsQueryResult.ref)
    await drums.clearAllDrumSlices()
  }

  if (error) throw new Error('FATAL: firestore error encountered')
  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="align-self-center sr-only">Loading...</span>
      </Spinner>
    )
  }
  if (drumsQueryResult) {
    return (
      <div className="drum-details-container">
        <h1>🥁</h1>
        <Button variant="success" onClick={handleClear}>
          Clear Grid
        </Button>
      </div>
    )
  }
}

export default DrumsDetails
