import React, {useState} from 'react'
import {MdSettings} from 'react-icons/md'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

import {Instrument} from '../../firestore/models'
import {getInstrumentKeysAndNames} from '../utils/MapInstruments'

export const ModifyInstrument = ({docRef, instrument}) => {
  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)

  const handleSubmit = async event => {
    event.preventDefault()
    const form = event.target
    console.log('trying to modify instrument')
    console.log('instrument: ', form.instrument.value)
    console.log('key: ', form.key.value)

    const newInstrumentName = form.instrument.value
    const newInstrumentKey = form.key.value
    const objectData = {}

    // add changes to objectData...
    if (newInstrumentName.length && newInstrumentName !== instrument.name) {
      objectData.name = newInstrumentName
    }
    if (newInstrumentKey !== instrument.key) {
      objectData.key = newInstrumentKey
    }

    // only perform an update if some change was made...
    if (Object.keys(objectData).length > 0) {
      const modifiedInstrument = Instrument.fromDocRef(docRef)
      await modifiedInstrument.update(objectData)
    }

    setShow(false)
  }

  const thisInstrument = instrument.name
  const instrumentKeysAndNames = getInstrumentKeysAndNames([thisInstrument])
  return (
    <React.Fragment>
      <Modal onHide={handleClose} show={show}>
        <Modal.Header closeButton>
          <Modal.Title>Modify Instrument</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group controlId="modifyInstrument.controlSelect1">
              <Form.Label>
                <strong>Instrument Type</strong>
              </Form.Label>
              <Form.Control as="select" name="instrument">
                <option value="">Select a new instrument type</option>
                {instrumentKeysAndNames.map(mappedInstrument => (
                  <option
                    key={mappedInstrument.key}
                    value={mappedInstrument.key}
                  >
                    {mappedInstrument.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="modifyInstrument.controlSelect2">
              <Form.Label>
                <strong>Instrument Key</strong>
              </Form.Label>
              <Form.Control as="select" name="key">
                <option value="G_MAJOR">G Major</option>
                <option value="G_MINOR">G Minor</option>
                <option value="PENTATONIC">Pentatonic</option>
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit" variant="primary">
              Modify
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <OverlayTrigger
        placement="auto"
        overlay={<Tooltip>Instrument settings...</Tooltip>}
      >
        <MdSettings className="icon-small" onClick={handleShow} />
      </OverlayTrigger>
    </React.Fragment>
  )
}
