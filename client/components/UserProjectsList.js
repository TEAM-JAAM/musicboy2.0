/* eslint-disable no-catch-shadow */
import React, {useState} from 'react'
import {useCollection} from 'react-firebase-hooks/firestore'
import {db, auth, provider} from '../firestore/db'
import {Project} from '../firestore/models'
import {withRouter} from 'react-router-dom'
import {Card, Button, Row, Badge, Spinner, Alert} from 'react-bootstrap'
import NewProjectForm from './NewProjectForm'

const UserProjectsList = props => {
  const email = auth.currentUser.email
  const uid = auth.currentUser.uid
  const [projectQueryResults, loading, error] = useCollection(
    Project.findAllProjectsForUserQuery(uid)
  )
  const projects = Project.fetchAllProjectsData(projectQueryResults)
  const {history} = props
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
    } catch (err) {
      console.log(docRef)
      console.log('delete failed: ', err)
    }
  }
  const handleLeave = docRef => {
    try {
      let project = Project.fromDocRef(docRef)
      project.removeUserFromProject({email, uid})
    } catch (err) {
      console.log(docRef)
      console.log('touble with leaving: ', err)
    }
  }
  const handleLogOut = () => {
    auth.signOut()
    history.push('/login')
  }

  if (error) throw new Error('FATAL: Firestore error encountered')

  if (loading) {
    return (
      <Row className="d-flex justify-content-center">
        <Spinner animation="border" role="status">
          <span className="align-self-center sr-only">Loading...</span>
        </Spinner>
      </Row>
    )
  }

  if (projectQueryResults) {
    return (
      <>
        <Card body border="dark" bg="dark" className="text-center dark-mode">
          <h2>My Account</h2>
          <span style={{color: 'white'}}>username: {email}</span>
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
        <NewProjectForm email={email} uid={uid} />
        {projects.length ? (
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
                    The Band: {project.members.length} out of {project.max}{' '}
                    members
                  </small>
                </Card.Footer>
              </Card>
            ))}
          </Row>
        ) : (
          <Alert className="text-center m-5 text-muted" variant="dark">
            <p>
              <strong>This is where your projects will appear.</strong>
            </p>
            <p>
              Go ahead and get started with a new project above. Otherwise, head
              over to the public tab to join a Jaam sesh.
            </p>
          </Alert>
        )}
      </>
    )
  }
}

export default withRouter(UserProjectsList)
