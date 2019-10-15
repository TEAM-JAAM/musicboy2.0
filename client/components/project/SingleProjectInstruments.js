import React, {useState} from 'react'
import {useCollection} from 'react-firebase-hooks/firestore'
import {MdAdd, MdGridOn, MdRemove} from 'react-icons/md'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
import Tooltip from 'react-bootstrap/Tooltip'

import {Project} from '../../firestore/models'
import {SingleInstrument} from '../instrument/SingleInstrument'
import {AddInstrument} from './AddInstrument'

export const SingleProjectInstruments = ({docRef}) => {
  const instrumentsCollectionRef = Project.findProjectInstrumentsQuery(docRef)
  const [instrumentQueryResult, loading, error] = useCollection(
    instrumentsCollectionRef
  )
  const instrumentDocRefs = Project.fetchInstrumentDocRefs(
    instrumentQueryResult
  )

  const [showAddInstrument, setShowAddInstrument] = useState(false)
  const handleShowAddInstrument = () => {
    setShowAddInstrument(true)
  }

  const handleCloseAddInstrument = () => {
    setShowAddInstrument(false)
  }

  const handleSubmitNewInstrument = async event => {
    event.preventDefault()
    const form = event.target
    console.log('trying to submit form')
    console.log('instrument: ', form.instrument.value)
    console.log('key: ', form.key.value)
    console.log('percussion: ', form.usePercussion.checked)
    // create the new instrument...
    // const project = Project.fromDocId(docRef)
    // await project.addInstrument({
    //   name: form.instrument.value,
    //   key: form.key.value
    // })

    // ...and drums, if requested...
    // if (form.usePercussion.checked) {
    //   await project.addDrums()
    // }

    setShowAddInstrument(false)
  }

  const handleIncreaseGrid = async () => {
    const projectDocRef = instrumentsCollectionRef.parent
    const project = Project.fromDocRef(projectDocRef)
    await project.addTimesliceBlock()
  }

  const handleDecreaseGrid = async () => {
    const projectDocRef = instrumentsCollectionRef.parent
    const project = Project.fromDocRef(projectDocRef)
    await project.removeTimesliceBlock()
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
    const instruments = Project.fetchExistingInstruments(instrumentDocRefs)
    return (
      <Container fluid className="mt-3">
        <Row>
          <Col>
            <OverlayTrigger
              placement="auto"
              overlay={<Tooltip>Add new instrument...</Tooltip>}
            >
              <Button
                variant="secondary"
                size="sm"
                onClick={handleShowAddInstrument}
              >
                <MdAdd className="icon" />
              </Button>
            </OverlayTrigger>
          </Col>
          <Col className="text-right">
            <ButtonGroup size="sm">
              <OverlayTrigger
                placement="auto"
                overlay={<Tooltip>Reduce grid size</Tooltip>}
              >
                <Button
                  onClick={handleDecreaseGrid}
                  size="sm"
                  variant="secondary"
                >
                  <MdRemove />
                  <MdGridOn className="icon" />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="auto"
                overlay={<Tooltip>Increase grid size...</Tooltip>}
              >
                <Button
                  onClick={handleIncreaseGrid}
                  size="sm"
                  variant="secondary"
                >
                  <MdGridOn className="icon" />
                  <MdAdd />
                </Button>
              </OverlayTrigger>
            </ButtonGroup>
          </Col>
        </Row>
        {instrumentDocRefs.map(instrumentDocRef => {
          return (
            <Row key={instrumentDocRef.id} className="mt-3">
              <Col>
                <SingleInstrument docRef={instrumentDocRef.ref} />
                <AddInstrument
                  show={showAddInstrument}
                  close={handleCloseAddInstrument}
                  submit={handleSubmitNewInstrument}
                  instruments={instruments}
                />
              </Col>
            </Row>
          )
        })}
      </Container>
    )
  }
}
