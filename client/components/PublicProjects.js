import React from 'react'
import {useCollection} from 'react-firebase-hooks/firestore'
import {Project} from '../firestore/models'
import {withRouter} from 'react-router-dom'
import {Card, Button, Row, Spinner, Badge, Col} from 'react-bootstrap'
import {auth} from '../firestore/db'

const PublicProjects = props => {
  const email = auth.currentUser.email
  const uid = auth.currentUser.uid
  const {history} = props
  const [projectQueryResults, loading, error] = useCollection(
    Project.findAllPublicProjectsQuery()
  )
  const projects = Project.fetchAllProjectsData(projectQueryResults)

  const handleClick = docRef => {
    const project = Project.fromDocRef(docRef)
    project.addUserToProject({email, uid})
    history.push(`/projects/${docRef.id}`)
  }
  const isOwner = project => {
    if (project.members[0] === email) return true
    return false
  }

  const featuredProject = projects[Math.floor(Math.random() * projects.length)]
  const joinOrJaam = project => {
    return project.members.includes(email) ? 'Go Jaam' : 'Join +'
  }
  // error handlers
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
        <Card
          className="m-5"
          text="white"
          // border="secondary"
          bg="dark"
        >
          <Card.Body>
            <Card.Title className="text-center">
              <strong>{featuredProject.name}</strong>
            </Card.Title>
            <Row>
              <Card.Text as={Col} md="10">
                Here's something special we thought you'd enjoy! This popular
                song was created for everyone to make it their own. Here at Jaam
                we want to promote sessions that inspire others to step outside
                the box and make something magical... together.
              </Card.Text>
              <Col className="mr-3 text-right">
                <Button
                  variant="success"
                  onClick={() => handleClick(featuredProject.docRef)}
                >
                  {joinOrJaam(featuredProject)}
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Row className="justify-content-md-center m-5">
          {projects.map(
            project =>
              project.members.length < project.max ||
              project.members.includes(email) ? (
                <Card
                  key={project.docRef.id}
                  style={{width: '25rem'}}
                  className="align-self-center m-2"
                  border="secondary"
                >
                  <Card.Img
                    onClick={() => handleClick(project.docRef)}
                    variant="top"
                    src={`https://dummyimage.com/1000x5:2/2274A5/fff.jpg&text=${
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
                      block
                      onClick={() => handleClick(project.docRef)}
                    >
                      {joinOrJaam(project)}
                    </Button>
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted">
                      The Band:{' '}
                      <strong>
                        {project.members.length} out of {project.max}{' '}
                      </strong>
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
}

export default withRouter(PublicProjects)
