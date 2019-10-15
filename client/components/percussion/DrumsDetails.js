import React, {useState} from 'react'
import {useDocument} from 'react-firebase-hooks/firestore'
import {
  Spinner,
  Card,
  Button,
  Alert,
  Container,
  OverlayTrigger,
  Row,
  Col,
  Tooltip
} from 'react-bootstrap'
import {MdGridOff, MdClear} from 'react-icons/md'
import {Drums} from '../../firestore/models'
import {kick} from '../../../instruments'

const DrumsDetails = ({docRef}) => {
  const [drumsQueryResult, loading, error] = useDocument(docRef)

  async function handleClear() {
    const drums = Drums.fromDocRef(drumsQueryResult.ref)
    await drums.clearAllDrumSlices()
    kick.triggerAttackRelease('A2', '16n')
  }

  const [show, setShow] = useState(false)

  function handleClose() {
    setShow(false)
  }

  function alertDeleteDrums() {
    setShow(true)
  }

  async function handleDeleteDrums() {
    const drums = Drums.fromDocRef(drumsQueryResult.ref)
    await drums.destroy()
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
      <React.Fragment>
        <Card
          bg="dark"
          text="white"
          border="light"
          className="mr-1 drum-details-card"
          style={{width: '10rem'}}
        >
          <div />
          <Card.Body className="drum-details-body">
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip>Clear grid</Tooltip>}
            >
              <MdGridOff
                className="icon-small clear-drums-btn"
                onClick={handleClear}
              />
            </OverlayTrigger>
            <h1>🥁</h1>
            {/* <Col> */}
            <OverlayTrigger
              placement="auto"
              overlay={<Tooltip>Delete percussion</Tooltip>}
            >
              <MdClear
                className="icon-small delete-drums-btn"
                onClick={alertDeleteDrums}
              />
            </OverlayTrigger>
            {/* </Col> */}
          </Card.Body>
          <Card.Title className="text-center instrument-card-title">
            Percussion
          </Card.Title>
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
              onClick={handleDeleteDrums}
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

export default DrumsDetails
