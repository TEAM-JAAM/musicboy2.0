import React, {useState} from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'

import {getInstrumentKeysAndNames} from '../utils/MapInstruments'

export const AddInstrument = ({show, close, error, submit}) => {
  const [checked, setChecked] = useState(false)
  const handleCheck = () => {
    setChecked(!checked)
  }
  const instrumentKeysAndNames = getInstrumentKeysAndNames()
  return (
    <Modal centered onHide={close} show={show}>
      <Modal.Header closeButton>
        <Modal.Title>Add Instrument</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submit}>
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
          <Form.Check
            type="switch"
            checked={checked}
            id="percussion-switch"
            label="Percission"
            name="usePercussion"
            onChange={handleCheck}
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
