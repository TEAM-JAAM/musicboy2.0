import React, {useState} from 'react'
import {useCollection} from 'react-firebase-hooks/firestore'
import {auth} from '../firestore/db'
import {Carousel, Spinner, Row, Alert, Badge} from 'react-bootstrap'
import {withRouter} from 'react-router-dom'
import {Project} from '../firestore/models'
import NewProjectForm from './NewProjectForm'

// need projects from database

const UserHome = props => {
  const email = auth.currentUser.email
  const uid = auth.currentUser.uid
  const {history} = props
  const [projectQueryResults, loading, error] = useCollection(
    Project.findAllProjectsForUserQuery(uid)
  )
  const projects = Project.fetchAllProjectsData(projectQueryResults)

  // carousel
  const width = 3000
  const height = () => {
    if (window.innerWidth < window.innerHeight) {
      return 2000
    }
    return 1000
  }

  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(null)
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex)
    setDirection(e.direction)
  }
  const colors = ['007BFF', '0069D9', '0062CC', '268FFF']
  const colorIdx = (index + 1) % colors.length
  const handleClick = () => {
    history.push(`/projects/${projects[index].docRef.id}`)
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
        <Alert variant="dark" className="text-center">
          <Alert.Heading>Hey, nice to see you</Alert.Heading>
          <p>This is Jaam. The place where musicians come to collaborate.</p>
          <hr />
          <p className="mb-0">
            {projects.length ? (
              <span>
                You have <Badge variant="dark">{projects.length}</Badge> jaam
                session{projects.length > 1 && 's'}.
              </span>
            ) : (
              "First, let's make a new project. Click the button below to get started"
            )}
          </p>
        </Alert>
        {projects.length ? (
          <Carousel
            activeIndex={index}
            direction={direction}
            onSelect={handleSelect}
            interval={3000}
          >
            {projects.map(project => (
              <Carousel.Item onClick={handleClick} key={project.docRef.id}>
                <img
                  className="d-block w-100"
                  src={`https://imgholder.ru/${width}x${height()}/${
                    colors[colorIdx]
                  }/adb9ca&text=${project.name}&font=kelson`}
                  alt={project.name}
                />
                <Carousel.Caption>
                  <p>
                    {project.image} The Band: {project.members.length} out of{' '}
                    {project.max}
                  </p>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        ) : null}
        <NewProjectForm email={email} uid={uid} />
      </>
    )
  }
}

export default withRouter(UserHome)
