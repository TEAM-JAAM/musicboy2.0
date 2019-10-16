import React, {useState} from 'react'
import {
  MdEdit,
  MdPersonAdd,
  MdDelete,
  MdRemoveCircle,
  MdLock,
  MdCheck
} from 'react-icons/md'
import {auth} from '../../firestore/db'
import {Modal, Button, Form, Row} from 'react-bootstrap'
import {Project, User} from '../../firestore/models'

const SingleProjectSettings = props => {
  const email = auth.currentUser.email
  const project = Project.fromDocRef(props.docref)
  const [title, setTitle] = useState(props.project.name)
  const [check, setCheck] = useState(false)
  const [emailField, setEmailField] = useState('')

  const handleTitleChange = () => {
    setCheck(false)
    setTitle(event.target.value)
  }
  const handleEmailChange = () => {
    setEmailField(event.target.value)
  }
  const handleRemove = async memberEmail => {
    event.preventDefault()
    try {
      const member = await User.findOne({email: memberEmail})
      const memberUid = member.ref().id
      project.removeUserFromProject({email: memberEmail, uid: memberUid})
      console.log('success')
    } catch (err) {
      console.log('touble with removiing: ', memberEmail)
      console.log('with error: ', err)
    }
  }
  const handleTitle = () => {
    event.preventDefault()
    const name = event.target.title.value
    project.update({name})
    setCheck(true)
  }
  const handleInvite = async () => {
    event.preventDefault()
    const inviteeEmail = event.target.email.value
    try {
      const invitee = await User.findOne({email: inviteeEmail})
      if (invitee) {
        const inviteeUid = invitee.ref().id
        project.addUserToProject({email: inviteeEmail, uid: inviteeUid})
        console.log('success')
        setEmailField('')
      } else {
        console.log('invitee returned val: ', invitee)
        console.log('trouble with adding: ', inviteeEmail)
        setEmailField('not a user')
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
              <h5>
                Title: <span className="text-muted">{props.project.name}</span>
              </h5>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="New Title"
              value={title}
              onChange={handleTitleChange}
            />
          </Form.Group>
          {check ? (
            <Button disabled variant="success">
              <MdCheck />
            </Button>
          ) : (
            <Button type="submit" variant="secondary">
              <MdEdit />
            </Button>
          )}
        </Form>
        {props.project.members.length < 5 && (
          <Form onSubmit={handleInvite}>
            <Form.Group controlId="email">
              <Form.Label>
                <h5>Invite by email</h5>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="enter email..."
                value={emailField}
                onChange={handleEmailChange}
              />
            </Form.Group>
            <Button type="submit" variant="secondary">
              <MdPersonAdd />
            </Button>
          </Form>
        )}
        {props.project.members.map(member => (
          <Row key={member} className="ml-3 mt-1 mb-1">
            {member === email ? (
              <Button disabled variant="secondary" className="mr-1" size="sm">
                <MdLock />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="outline-danger"
                onClick={() => handleRemove(member)}
                className="mr-1"
                size="sm"
              >
                <MdRemoveCircle />
              </Button>
            )}
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
