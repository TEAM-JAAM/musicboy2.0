import React, {useState} from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'

import {getInstrumentKeysAndNames} from '../utils/MapInstruments'

export const AddInstrument = ({show, close, submit, instruments}) => {
  const [isChecked, setChecked] = useState(false)
  const handleCheck = () => {
    setChecked(!isChecked)
  }
  const instrumentKeysAndNames = getInstrumentKeysAndNames(instruments)
  return (
    <Modal bg="dark" onHide={close} show={show}>
      <Modal.Header closeButton>
        <Modal.Title>Add Instrument</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submit}>
        <Modal.Body>
          <Form.Group controlId="addInstrument.controlSelect1">
            <Form.Label>
              <strong>Instrument Type</strong>
            </Form.Label>
            <Form.Control as="select" name="instrument" required>
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
            id="percussionSwitch"
            label="Percussion"
            name="usePercussion"
            onChange={handleCheck}
            value={isChecked}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Close
          </Button>
          <Button type="submit" variant="primary">
            Add
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
