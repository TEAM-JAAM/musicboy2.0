import React from 'react'
import {useDocument} from 'react-firebase-hooks/firestore'
import {
  Spinner,
  Card,
  Container,
  OverlayTrigger,
  Row,
  Col,
  Tooltip
} from 'react-bootstrap'
import {MdGridOff, MdSettings} from 'react-icons/md'
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
        style={{width: '10rem'}}
      >
        <Card.Header className="p-1">
          <Container fluid className="pl-0 pr-0 drum-details-container">
            <Row>
              <Col className="ml-auto pl-0 pr-0 text-right">
                <OverlayTrigger
                  placement="auto"
                  overlay={<Tooltip>Clear grid</Tooltip>}
                >
                  <MdGridOff className="icon-small" onClick={handleClear} />
                </OverlayTrigger>
                <OverlayTrigger
                  placement="auto"
                  overlay={<Tooltip>Instrument settings...</Tooltip>}
                >
                  <MdSettings className="icon-small" />
                </OverlayTrigger>
              </Col>
            </Row>
          </Container>
        </Card.Header>
        <Card.Body>
          <Card.Title className="text-center instrument-card-title">
            <h1>🥁</h1>
          </Card.Title>
        </Card.Body>
      </Card>
    )
  }
}

export default DrumsDetails
