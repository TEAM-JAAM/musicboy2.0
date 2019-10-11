import React from 'react'
import {useCollection} from 'react-firebase-hooks/firestore'
import {Project} from '../firestore/models'
import {withRouter} from 'react-router-dom'
import {Card, Button, Row} from 'react-bootstrap'

const UserProjectsList = props => {
  const {projects, email, uid} = props
  const isOwner = project => {
    if (project.members[0] === email) return true
    return false
  }
  const handleClick = id => {
    props.history.push(`/projects/${id}`)
  }
  const handleDelete = id => {
    // delete stub goes here
  }
  const handleLeave = docRef => {
    try {
      let project = Project.fromDocRef(docRef)
      project.removeUserFromProject({email, uid})
    } catch (error) {
      console.log(docRef)
      console.log('touble with leaving: ', error)
    }
  }

  return (
    <>
      <Card body border="dark" bg="light" className="text-center">
        <h2>My Account</h2>
        <span>username: {email}</span>
        <a href="home">{'  '}Move logout here one day plzzzzzzz</a>
      </Card>
      <Row className="justify-content-md-center m-5">
        {projects.map(
          project =>
            project.members.length < project.max ? (
              <Card
                key={project.docRef.id}
                style={{width: '25rem'}}
                className="align-self-center m-2"
                border="primary"
              >
                <Card.Img
                  variant="top"
                  src={`https://dummyimage.com/1000x5:2/007bff/fff.jpg&text=${
                    project.name
                  }`}
                />
                <Card.Body>
                  <Button
                    variant="outline-success"
                    size="lg"
                    block
                    onClick={() => handleClick(project.docRef.id)}
                  >
                    Go Jaam
                  </Button>
                  {isOwner(project) ? (
                    <Button
                      variant="outline-danger"
                      block
                      onClick={() => handleDelete(project.docRef.id)}
                    >
                      Delete
                    </Button>
                  ) : (
                    <Button
                      variant="outline-danger"
                      block
                      onClick={() => handleLeave(project.docRef)}
                    >
                      Leave This Jaam Sesh
                    </Button>
                  )}
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">
                    The Band: {project.members.length} out of {project.max}{' '}
                    members
                  </small>
                </Card.Footer>
              </Card>
            ) : null
        )}
      </Row>
    </>
  )
}

export default withRouter(UserProjectsList)
