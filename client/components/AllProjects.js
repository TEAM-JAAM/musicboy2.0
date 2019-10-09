import React, {useState} from 'react'
import {useCollection} from 'react-firebase-hooks/firestore'
import {
  ToggleButtonGroup,
  Carousel,
  Row,
  ToggleButton,
  Spinner
} from 'react-bootstrap'
import {withRouter} from 'react-router-dom'

import {Project} from '../firestore/models'

// need projects from database

const AllProjects = props => {
  const {email, history, uid} = props
  const [projectQueryResults, loading, error] = useCollection(
    Project.findAllProjectsForUserQuery(uid)
  )
  const projects = Project.fetchProjectData(projectQueryResults)

  // carousel
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(null)
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex)
    setDirection(e.direction)
  }
  const handleClick = () => {
    // go to project page at current index
    console.log('will go to: ', projects[index])
    console.log('history: ', history)
    console.log('will push: ', `/projects/${projects[index].docRef.id}`)
    history.push(`/projects/${projects[index].docRef.id}`)
  }

  // toggle buttons
  const [value, setValue] = useState(1)
  const viewChanger = project => {
    if (value === 1) {
      return project.members.includes(email)
    } else {
      return !project.members.includes(email)
    }
  }
  const handleChange = val => {
    setValue(val)
  }

  if (error) throw new Error('Firestore error encountered')

  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="align-self-center sr-only">Loading...</span>
      </Spinner>
    )
  }

  if (projectQueryResults) {
    return (
      <div>
        <div className="center">
          <Row className="justify-content-md-center">
            <ToggleButtonGroup
              type="radio"
              value={value}
              name="projectToggle"
              onChange={handleChange}
            >
              <ToggleButton variant="outline-dark" value={1}>
                My Projects
              </ToggleButton>
              <ToggleButton variant="outline-dark" value={2}>
                Public Projects
              </ToggleButton>
            </ToggleButtonGroup>
          </Row>
        </div>
        <Carousel
          activeIndex={index}
          direction={direction}
          onSelect={handleSelect}
          onClick={handleClick}
        >
          {projects &&
            projects.map(project => {
              return viewChanger(project) ? (
                <Carousel.Item key={project.name}>
                  <img
                    className="d-block w-100"
                    src={`https://imgholder.ru/2500x800/8493a8/adb9ca&text=${
                      project.name
                    }&font=kelson`}
                    alt={project.name}
                  />
                  <Carousel.Caption>
                    <h3>{project.image}</h3>
                    <p>
                      The Band: {project.members.length} out of {project.max}
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
              ) : null
            })}
        </Carousel>
      </div>
    )
  }
}

export default withRouter(AllProjects)
