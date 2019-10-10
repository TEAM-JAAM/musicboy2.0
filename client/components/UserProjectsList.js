import React from 'react'
import {useCollection} from 'react-firebase-hooks/firestore'
import {Project} from '../firestore/models'
import {withRouter} from 'react-router-dom'
import {Card, Button, Row} from 'react-bootstrap'

const UserProjectsList = props => {
  const {projects} = props
  const featuredProject = projects[1]
  console.log('featured project ', featuredProject)
  return (
    <>
      <Card body border="dark" bg="light" className="text-center">
        <h2>My Account</h2>
      </Card>
      {/*
        need to separate into two sections
        OWNED and participating in
      */}
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
                  src={`https://imgholder.ru/500x200/007BFF/adb9ca&text=${
                    project.name
                  }&font=bebas`}
                />
                <Card.Body>
                  <Button variant="outline-success" size="lg" block>
                    Play
                  </Button>
                  <Button variant="outline-danger" block>
                    Delete
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

export default withRouter(UserProjectsList)
