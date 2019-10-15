import React, {useState} from 'react'
import {MdAdd} from 'react-icons/md'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'

import {Project} from '../../firestore/models'
import {getInstrumentKeysAndNames} from '../utils/MapInstruments'

export const AddInstrument = ({docRef, hasPercussion}) => {
  const [isChecked, setChecked] = useState(hasPercussion)
  const handleCheck = () => {
    setChecked(!isChecked)
  }

  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)

  const handleSubmit = async event => {
    event.preventDefault()
    const form = event.target

    // create the new instrument... The instrument name may
    // be empty, indicating that, perhaps, we are only adding
    // percussion...
    const project = Project.fromDocId(docRef)
    const instrumentName = form.instrument.value
    if (instrumentName.length) {
      await project.addInstrument({
        name: form.instrument.value,
        key: form.key.value
      })
    }

    // ...and drums, if requested...
    if (form.usePercussion.checked) {
      await project.addDrums()
    }

    setShow(false)
  }

  const instrumentKeysAndNames = getInstrumentKeysAndNames()

  return (
    <React.Fragment>
      <Modal onHide={handleClose} show={show}>
        <Modal.Header closeButton>
          <Modal.Title>Add Instrument</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group controlId="addInstrument.controlSelect1">
              <Form.Label>
                <strong>Instrument Type</strong>
              </Form.Label>
              <Form.Control as="select" name="instrument">
                <option value="">Select an instrument type</option>
                {instrumentKeysAndNames.map(instrument => (
                  <option key={instrument.key} value={instrument.key}>
                    {instrument.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="addInstrument.controlSelect2">
              <Form.Label>
                <strong>Instrument Key</strong>
              </Form.Label>
              <Form.Control as="select" name="key">
                <option value="G_MAJOR">G Major</option>
                <option value="G_MINOR">G Minor</option>
                <option value="PENTATONIC">Pentatonic</option>
              </Form.Control>
            </Form.Group>
            <Form.Switch
              checked={isChecked}
              disabled={hasPercussion}
              id="percussion-switch"
              label="Percussion"
              name="usePercussion"
              onChange={handleCheck}
              value={isChecked}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit" variant="primary">
              Add
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Button variant="secondary" size="sm" onClick={handleShow}>
        <MdAdd className="icon" />
      </Button>
    </React.Fragment>
  )
}
