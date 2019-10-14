import React from 'react'
import {useDocument} from 'react-firebase-hooks/firestore'
import {Spinner, Button, Card, Container} from 'react-bootstrap'
import {Drums} from '../../firestore/models'
import {kick} from '../../../instruments'

const DrumsDetails = ({docRef}) => {
  const [drumsQueryResult, loading, error] = useDocument(docRef)
  // const drumsData = Drums.fetchDrumsData(drumsQueryResult);

  async function handleClear() {
    const drums = Drums.fromDocRef(drumsQueryResult.ref)
    await drums.clearAllDrumSlices()
    kick.triggerAttackRelease('A2', '16n')
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
      <Card
        bg="dark"
        text="white"
        border="light"
        className="mr-1 drum-details-card"
        style={{width: '15rem'}}
      >
        <Container fluid className="pl-0 pr-0 drum-details-container">
          <h1 className="drum-icon">🥁</h1>
          <Button
            variant="secondary"
            className="clear-drums-btn"
            size="sm"
            onClick={handleClear}
          >
            clear
          </Button>
          <Button variant="secondary" className="clear-drums-btn" size="sm">
            hide
          </Button>
        </Container>
      </Card>
    )
  }
}

export default DrumsDetails
