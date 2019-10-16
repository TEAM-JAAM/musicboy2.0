import React, {useState} from 'react'
import {useDocument} from 'react-firebase-hooks/firestore'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
import Tooltip from 'react-bootstrap/Tooltip'
import {Instrument} from '../../firestore/models'
import {MdClear, MdGridOff} from 'react-icons/md'

import {kick} from '../../../instruments'
import {mapInstrumentImage, mapInstrumentName} from '../utils/MapInstruments'
import {ModifyInstrument} from '../project/ModifyInstrument'

export const SingleInstrumentDetails = ({docRef}) => {
  const [instrumentQueryResult, loading, error] = useDocument(docRef)
  const instrumentData = Instrument.fetchInstrumentData(instrumentQueryResult)

  // Alert control...
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)

  async function handleClear() {
    kick.triggerAttackRelease('A2', '16n')
    const instrument = Instrument.fromDocRef(instrumentQueryResult.ref)
    await instrument.clearAllTimeslices()
  }

  function alertDeleteInstrument() {
    setShow(true)
  }

  async function handleDeleteInstrument() {
    console.log('attempting to delete instrument: ', instrumentData.name)
    const instrument = Instrument.fromDocRef(instrumentQueryResult.ref)
    await instrument.destroy()

    setShow(false)
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
      <React.Fragment>
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
                <Col className="pl-0">
                  <OverlayTrigger
                    placement="auto"
                    overlay={<Tooltip>Clear grid</Tooltip>}
                  >
                    <MdGridOff className="icon-small" onClick={handleClear} />
                  </OverlayTrigger>
                  <ModifyInstrument
                    docRef={docRef}
                    instrument={instrumentData}
                  />
                </Col>
                <Col className="ml-auto pr-0 text-right">
                  <OverlayTrigger
                    placement="auto"
                    overlay={<Tooltip>Remove instrument...</Tooltip>}
                  >
                    <MdClear
                      className="icon-small"
                      onClick={alertDeleteInstrument}
                    />
                  </OverlayTrigger>
                </Col>
              </Row>
            </Container>
          </Card.Header>
          <Card.Img
            style={{height: '5rem'}}
            src={mapInstrumentImage(instrumentData.name)}
            variant="top"
          />
          <Card.Body>
            <Card.Title className="text-center instrument-card-title">
              {mapInstrumentName(instrumentData.name)}
            </Card.Title>
          </Card.Body>
        </Card>

        <Alert dismissible onClose={handleClose} show={show} variant="danger">
          <Alert.Heading>Delete Instrument</Alert.Heading>
          <p>
            Are you sure you want to delete this instrument and all of its
            instrument data?
          </p>
          <p className="text-muted">Note: cannot be undone</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={handleClose} variant="secondary">
              Close
            </Button>
            <Button
              className="ml-2"
              onClick={handleDeleteInstrument}
              variant="primary"
            >
              Delete
            </Button>
          </div>
        </Alert>
      </React.Fragment>
    )
  }
}
