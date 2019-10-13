import React from 'react'
import {useCollection} from 'react-firebase-hooks/firestore'
import {Project} from '../firestore/models'
import {withRouter} from 'react-router-dom'
import {Card, Button, Row, Spinner, Badge} from 'react-bootstrap'
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

  const featuredProject = projects[Math.floor(Math.random() * projects.length)]
  const joinOrJaam = () => {
    return featuredProject.members.includes(email) ? 'Go Jaam' : 'Join +'
  }
  // error handlers
  if (error) throw new Error('FATAL: Firestore error encountered')
  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="align-self-center sr-only">Loading...</span>
      </Spinner>
    )
  }
  if (projectQueryResults) {
    return (
      <>
        <Card className="text-center m-5" bg="warning">
          <Card.Header>Featured Song</Card.Header>
          <Card.Body>
            <Card.Title>
              <strong>{featuredProject.name}</strong>
            </Card.Title>
            <Card.Text>
              Here's something special we thought you'd enjoy! Here at Jaam we
              want to promote sessions that inspire others to step outside the
              box and make something magical.
            </Card.Text>
            <Button
              variant="success"
              onClick={() => handleClick(featuredProject.docRef)}
            >
              {joinOrJaam()}
            </Button>
          </Card.Body>
        </Card>
        <Card body border="dark" bg="light" className="text-center">
          <h2>Open Jaam Sessions</h2>
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
                  border="primary"
                >
                  <Card.Img
                    onClick={() => handleClick(project.docRef)}
                    variant="top"
                    src={`https://dummyimage.com/1000x5:2/007bff/fff.jpg&text=${
                      project.name
                    }`}
                  />
                  <Card.Body>
                    <Card.Title>
                      Manager:{' '}
                      <strong>
                        {project.members[0].slice(
                          0,
                          project.members[0].indexOf('@')
                        )}
                      </strong>
                      <Card.Text>
                        <Badge variant="success" className="text-right">
                          {project.permissions}
                        </Badge>
                      </Card.Text>
                    </Card.Title>
                    <Button
                      variant="outline-success"
                      block
                      onClick={() => handleClick(project.docRef)}
                    >
                      {joinOrJaam()}
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
