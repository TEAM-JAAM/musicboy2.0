import React, {useState} from 'react'
import {
  Modal,
  Button,
  Tooltip,
  OverlayTrigger,
  ToggleButton,
  ToggleButtonGroup,
  Form
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
    const data = {
      name: event.target.title.value,
      emoji: event.target.image.value,
      permissions: event.target.permissions.value ? 'Public' : 'Private',
      tempo: event.target.tempo.value,
      members: [email],
      memberUids: [uid],
      max: 5
    }
    const project = await Project.findOrCreate(data)
    await project.addInstrument({name: 'synth'})
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
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>You're making a masterpiece!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Now, time for some decisions.......
            <div className="form-options">
              <label htmlFor="title">Title</label>
              <input name="title" type="text" placeholder="Project Name" />
            </div>
            <div className="form-options">
              <label htmlFor="image">Image</label>
              <select className="emoji-option" name="image">
                <option value="🎵">🎵</option>
                <option value="🎸">🎸</option>
                <option value="🎷">🎷</option>
                <option value="🎹">🎹</option>
                <option value="🎻">🎻</option>
                <option value="🎤">🎤</option>
                <option value="🎺">🎺</option>
                <option value="🎧">🎧</option>
                <option value="🥁">🥁</option>
              </select>
            </div>
            <div>
              <div>
                <label htmlFor="permissions">
                  Public?
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>If yes, anyone can join your band</Tooltip>
                    }
                  >
                    <img src="https://img.icons8.com/color/20/000000/info--v2.png" />
                  </OverlayTrigger>
                </label>
                <ToggleButtonGroup
                  name="permissions"
                  type="radio"
                  value={publicVal}
                  onChange={handleSwitch}
                >
                  <ToggleButton variant="outline-success" value={true}>
                    Yes
                  </ToggleButton>
                  <ToggleButton variant="outline-secondary" value={false}>
                    No
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
            </div>
            <div>
              <label htmlFor="tempo">
                Tempo
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>The rate your song will play</Tooltip>}
                >
                  <img src="https://img.icons8.com/color/20/000000/info--v2.png" />
                </OverlayTrigger>
              </label>
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
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit" variant="primary">
              Create
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      <Button
        variant="danger"
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
