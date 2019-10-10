import React from 'react'
import {useCollection} from 'react-firebase-hooks/firestore'
import {Project} from '../firestore/models'
import {withRouter} from 'react-router-dom'
import {Card, Button, Row} from 'react-bootstrap'

const PublicProjects = props => {
  const {projects} = props
  const featuredProject = projects[1]
  console.log('featured project ', featuredProject)
  return (
    <>
      <Card className="text-center m-5">
        <Card.Header>Song of the Week</Card.Header>
        <Card.Body>
          <Card.Title>
            <strong>{featuredProject.name}</strong>
          </Card.Title>
          <Card.Text className="text-muted">
            Here's something special we thought you'd enjoy! Here at Jaam we
            want to promote sessions that inspire others to step outside the box
            and make something magical.
          </Card.Text>
          <Button variant="success">Go Jaam</Button>
        </Card.Body>
      </Card>
      <Card body border="dark" bg="light" className="text-center">
        <h2>Open Jaam Sessions</h2>
      </Card>
      <Row className="align-self-center m-5">
        {projects.map(
          project =>
            project.members.length < project.max ? (
              <Card
                key={project.docRef.id}
                style={{width: '25rem'}}
                className="align-self-center m-2"
              >
                <Card.Img
                  variant="top"
                  src={`https://imgholder.ru/480x200/007BFF/adb9ca&text=${
                    project.name
                  }&font=bebas`}
                />
                <Card.Body>
                  <Button variant="outline-success" block>
                    Join +
                  </Button>
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

export default withRouter(PublicProjects)
