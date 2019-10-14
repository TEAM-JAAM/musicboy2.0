import React from 'react'
import {useDocument} from 'react-firebase-hooks/firestore'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
import Tooltip from 'react-bootstrap/Tooltip'
import {Instrument} from '../../firestore/models'
import {MdGridOff, MdSettings} from 'react-icons/md'

import {kick} from '../../../instruments'
import {mapInstrumentImage, mapInstrumentName} from '../utils/MapInstruments'

export const SingleInstrumentDetails = ({docRef}) => {
  const [instrumentQueryResult, loading, error] = useDocument(docRef)
  const instrumentData = Instrument.fetchInstrumentData(instrumentQueryResult)

  async function handleClear() {
    kick.triggerAttackRelease('A2', '16n')
    const instrument = Instrument.fromDocRef(instrumentQueryResult.ref)
    await instrument.clearAllTimeslices()
  }

  if (error) throw new Error('FATAL: firestore error encountered')
  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="align-self-center sr-only">Loading...</span>
      </Spinner>
    )
  }
  if (instrumentQueryResult) {
    return (
      <Card
        bg="dark"
        text="white"
        border="light"
        className="mr-1"
        style={{width: '10rem'}}
      >
        <Card.Header className="p-1">
          <Container fluid className="ml-0 mr-0">
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
        <Card.Img src={mapInstrumentImage(instrumentData.name)} variant="top" />
        <Card.Body>
          <Card.Title className="text-center instrument-card-title">
            {mapInstrumentName(instrumentData.name)}
          </Card.Title>
          {/* <Card.Text className="text-muted">{instrumentData.key}</Card.Text> */}
        </Card.Body>
      </Card>
    )
  }
}
