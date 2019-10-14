import React, {useState} from 'react'
import {useCollection} from 'react-firebase-hooks/firestore'
import {auth} from '../firestore/db'
import {Carousel, Spinner} from 'react-bootstrap'
import {withRouter} from 'react-router-dom'
import {Project} from '../firestore/models'

// need projects from database

const CarouselProjects = props => {
  // const email = auth.currentUser.email
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
      <Spinner animation="border" role="status">
        <span className="align-self-center sr-only">Loading...</span>
      </Spinner>
    )
  }

  if (projectQueryResults) {
    return (
      <>
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
      </>
    )
  }
}

export default withRouter(CarouselProjects)
