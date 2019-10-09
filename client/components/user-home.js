import React, {useState} from 'react'
import AllProjects from './AllProjects'
import {auth} from '../firestore/db'
import {Modal, Button, Tooltip, OverlayTrigger} from 'react-bootstrap'

/**
 * COMPONENT
 */
export const UserHome = () => {
  const email = auth.currentUser.email

  // modal
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const handleSubmit = () => {
    event.preventDefault()
    const data = {
      name: event.target.title.value,
      emoji: event.target.image.value,
      permissions: event.target.privacy.value,
      tempo: event.target.tempo.value,
      members: ['emails']
    }
    console.log(data)
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
              <select name="image">
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
                <label htmlFor="public">Public?</label>
                <input type="radio" name="privacy" id="public" value={false} />
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

              <output>{rangeVal}</output>
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
      <AllProjects email={email} />
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
