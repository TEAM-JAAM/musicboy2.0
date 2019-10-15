import React, {useState} from 'react'
import {MdEdit, MdPersonAdd, MdDelete, MdRemoveCircle} from 'react-icons/md'
import {auth} from '../../firestore/db'
import {Modal, Button, Form, Row} from 'react-bootstrap'
import {Project, User} from '../../firestore/models'

const SingleProjectSettings = props => {
  const email = auth.currentUser.email
  const project = Project.fromDocRef(props.project.docRef)
  const [title, setTitle] = useState(props.project.name)
  // const [failed, setFailed] = useState(false)

  const handleChange = () => {
    setTitle(event.target.value)
  }
  const handleRemove = member => {
    event.preventDefault()
    console.log(member)
  }
  const handleTitle = () => {
    event.preventDefault()
    console.log(event.target.title.value)
  }
  const handleInvite = async () => {
    event.preventDefault()
    const inviteeEmail = event.target.email.value
    try {
      const isUser = await User.findOne({email: inviteeEmail})
      if (isUser) {
        console.log(isUser)
      } else {
        console.log('isUser val: ', isUser)
        console.log('trouble with adding: ', inviteeEmail)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Modal {...props}>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleTitle}>
          <Form.Group controlId="title">
            <Form.Label>
              <h5>Title</h5>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="New Title"
              value={title}
              onChange={handleChange}
            />
          </Form.Group>
          <Button type="submit" variant="secondary">
            <MdEdit />
          </Button>
        </Form>
        {props.project.members.length < 5 && (
          <Form onSubmit={handleInvite}>
            <Form.Group controlId="email">
              <Form.Label>
                <h5>Invite by email</h5>
              </Form.Label>
              <Form.Control type="email" placeholder="enter email..." />
            </Form.Group>
            <Button type="submit" variant="secondary">
              <MdPersonAdd />
            </Button>
          </Form>
        )}
        {props.project.members.map(member => (
          <Row key={member} className="ml-3 mt-1 mb-1">
            <Button
              type="submit"
              variant="outline-danger"
              onClick={() => handleRemove(member)}
              className="mr-1"
              size="sm"
            >
              <MdRemoveCircle />
            </Button>
            <h5>{member}</h5>
          </Row>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide} variant="secondary">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default SingleProjectSettings
