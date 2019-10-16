import React, {useState} from 'react'
import {
  Modal,
  Button,
  Tooltip,
  OverlayTrigger,
  ToggleButton,
  ToggleButtonGroup,
  Form,
  InputGroup,
  Col,
  Row
} from 'react-bootstrap'
import {Project} from '../firestore/models'
import {withRouter} from 'react-router-dom'

/**
 * COMPONENT
 */
const NewProjectForm = props => {
  const {email, uid, history} = props
  // privacy switch
  const [publicVal, setPublicVal] = useState(false)

  const handleSwitch = () => {
    setPublicVal(!publicVal)
  }

  // modal
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleSubmit = async () => {
    event.preventDefault()

    // gather data object for project
    const data = {
      name: event.target.title.value,
      emoji: '🎷',
      permissions: publicVal ? 'Public' : 'Private',
      tempo: event.target.tempo.value,
      members: [email],
      memberUids: [uid],
      max: 5
    }

    // gather instruments for project
    const instruments = {
      marimba: event.target.marimba.checked,
      steelPan: event.target.steelPan.checked,
      electricCello: event.target.electricCello.checked,
      synth: event.target.synth.checked
    }
    let instrumentsToAdd = Object.keys(instruments)
    instrumentsToAdd = instrumentsToAdd.filter(i => instruments[i])

    // create project with instruments
    const project = await Project.findOrCreate(data)
    instrumentsToAdd.forEach(async instrument => {
      await project.addInstrument({name: instrument})
    })
    const id = project.ref().id
    history.push(`/projects/${id}`)
    handleClose()
  }
  const [rangeVal, setRangeVal] = useState(50)
  const handleRange = () => {
    setRangeVal(event.target.value)
  }

  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Form className="dark-mode dark-bg" onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="text-center">
              You're making a masterpiece!
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Row>
              <Form.Group as={Col} md="6" controlId="title">
                <Form.Label>
                  <h5>Title</h5>
                </Form.Label>
                <Form.Control type="text" placeholder="Enter Title" />
              </Form.Group>

              <Form.Group as={Col} md="3" controlId="permissions">
                <Form.Label>
                  <h5>
                    Public?
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip>If yes, anyone can join your band</Tooltip>
                      }
                    >
                      <img src="https://img.icons8.com/color/20/000000/info--v2.png" />
                    </OverlayTrigger>
                  </h5>
                </Form.Label>
                <Form.Switch
                  id="permissions"
                  onChange={handleSwitch}
                  value={publicVal}
                  label={publicVal ? 'yes' : 'no'}
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="tempo">
                <Form.Label>
                  <h5>
                    Tempo
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>The rate your song will play</Tooltip>}
                    >
                      <img src="https://img.icons8.com/color/20/000000/info--v2.png" />
                    </OverlayTrigger>
                  </h5>
                </Form.Label>
                <input
                  type="range"
                  name="tempo"
                  min="50"
                  max="200"
                  onInput={handleRange}
                />
                <div>
                  <output>{rangeVal} bpm</output>
                </div>
              </Form.Group>
            </Form.Row>
            <fieldset>
              <Form.Group>
                <Form.Label>
                  <h5>Add Instruments</h5>
                </Form.Label>
                <Form.Row>
                  <Form.Check
                    label="Electric Guitar"
                    name="instruments"
                    id="marimba"
                  />
                  <Form.Check label="Synth" name="instruments" id="synth" />
                  <Form.Check
                    label="Electric Cello"
                    name="instruments"
                    id="electricCello"
                  />
                  <Form.Check
                    label="Steel Pan"
                    name="instruments"
                    id="steelPan"
                  />
                </Form.Row>
              </Form.Group>
            </fieldset>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit" variant="primary">
              Create
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Button
        variant="success"
        type="primary"
        size="lg"
        block
        onClick={handleShow}
      >
        New Project
      </Button>
    </div>
  )
}

export default withRouter(NewProjectForm)
