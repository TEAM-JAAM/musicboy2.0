import React from 'react'
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

export const SingleProjectInstruments = ({docRef}) => {
  const instrumentsCollectionRef = Project.findProjectInstrumentsQuery(docRef)
  const [instrumentQueryResult, loading, error] = useCollection(
    instrumentsCollectionRef
  )
  const instrumentDocRefs = Project.fetchInstrumentDocRefs(
    instrumentQueryResult
  )

  const handleAddInstrument = event => {
    console.log('iniitate add instrument dialog...')
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
                onClick={handleAddInstrument}
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
                <Button variant="secondary" size="sm">
                  <MdRemove />
                  <MdGridOn className="icon" />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="auto"
                overlay={<Tooltip>Increase grid size...</Tooltip>}
              >
                <Button variant="secondary" size="sm">
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
              </Col>
            </Row>
          )
        })}
      </Container>
    )
  }
}
