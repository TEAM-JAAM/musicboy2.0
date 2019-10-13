import React, {useState} from 'react'
import {useCollection} from 'react-firebase-hooks/firestore'
import {db, auth, provider} from '../firestore/db'
import {Project} from '../firestore/models'
import {withRouter} from 'react-router-dom'
import {Card, Button, Row, Badge} from 'react-bootstrap'

const UserProjectsList = props => {
  const email = auth.currentUser.email
  const uid = auth.currentUser.uid
  const {projects, history} = props
  const isOwner = project => {
    if (project.members[0] === email) return true
    return false
  }
  const handleClick = id => {
    props.history.push(`/projects/${id}`)
  }
  // const [disable, setDisable] = useState(false)

  const handleDelete = docRef => {
    // setDisable(true)
    let project = Project.fromDocRef(docRef)
    try {
      project.destroy()
    } catch (error) {
      console.log(docRef)
      console.log('delete failed: ', error)
    }
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
  const handleLogOut = () => {
    auth.signOut()
    history.push('/login')
  }

  return (
    <>
      <Card body border="dark" bg="light" className="text-center">
        <h2>My Account</h2>
        <span>username: {email}</span>
        <div>
          <a href="#" onClick={handleLogOut}>
            <h5>
              <Badge pill variant="primary">
                LOGOUT
              </Badge>
            </h5>
          </a>
        </div>
      </Card>
      <Row className="justify-content-md-center m-5">
        {projects.map(project => (
          <Card
            key={project.docRef.id}
            style={{width: '25rem'}}
            className="align-self-center m-2"
            border="primary"
          >
            <Card.Img
              onClick={() => handleClick(project.docRef.id)}
              variant="top"
              src={`https://dummyimage.com/1000x5:2/007bff/fff.jpg&text=${
                project.name
              }`}
            />
            <Card.Body>
              <Card.Text>
                This session is{' '}
                {project.permissions === 'Public' ? (
                  <Badge variant="success">{project.permissions}</Badge>
                ) : (
                  <Badge variant="secondary">{project.permissions}</Badge>
                )}
                <br />
                Managed by:{' '}
                <strong>
                  {isOwner(project)
                    ? 'Me'
                    : project.members[0].slice(
                        0,
                        project.members[0].indexOf('@')
                      )}
                </strong>
              </Card.Text>
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
                  onClick={() => handleDelete(project.docRef)}
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
                The Band: {project.members.length} out of {project.max} members
              </small>
            </Card.Footer>
          </Card>
        ))}
      </Row>
    </>
  )
}

export default withRouter(UserProjectsList)
