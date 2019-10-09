import React, {useState} from 'react'
import {useCollection} from 'react-firebase-hooks/firestore'
import {MdViewCarousel, MdGroup, MdList, MdPerson, MdHome} from 'react-icons/md'
import {
  ToggleButtonGroup,
  Carousel,
  Row,
  ToggleButton,
  Spinner,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap'
import {withRouter} from 'react-router-dom'
import PublicProjects from './PublicProjects'
import {Project} from '../firestore/models'

// need projects from database

const AllProjects = props => {
  const {email, history, uid} = props
  const [projectQueryResults, loading, error] = useCollection(
    Project.findAllProjectsForUserQuery(uid)
  )
  const projects = Project.fetchProjectData(projectQueryResults)

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
    console.log('will go to: ', projects[index])
    console.log('history: ', history)
    console.log('will push: ', `/projects/${projects[index].docRef.id}`)
    history.push(`/projects/${projects[index].docRef.id}`)
  }

  // toggle buttons
  const [value, setValue] = useState(1)
  const viewChanger = project => {
    if (value % 2) {
      return project.members.includes(email)
    } else {
      return project.permissions === 'Public'
    }
  }
  const handleChange = val => {
    setValue(val)
  }

  // firestore returns
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
          <Row className="justify-content-md-center mb-2">
            <ToggleButtonGroup
              type="radio"
              value={value}
              name="projectToggle"
              onChange={handleChange}
            >
              <ToggleButton key={1} variant="outline-dark" value={1}>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>my songs</Tooltip>}
                >
                  <MdHome className="icon" />
                </OverlayTrigger>
              </ToggleButton>
              <ToggleButton key={2} variant="outline-dark" value={2}>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>public songs</Tooltip>}
                >
                  <MdGroup className="icon" />
                </OverlayTrigger>
              </ToggleButton>
              <ToggleButton key={3} variant="outline-dark" value={3}>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>all songs list view</Tooltip>}
                >
                  <MdList className="icon" />
                </OverlayTrigger>
              </ToggleButton>
            </ToggleButtonGroup>
          </Row>
        </div>
        <Carousel
          activeIndex={index}
          direction={direction}
          onSelect={handleSelect}
          interval={3000}
        >
          {projects.map(project => {
            return viewChanger(project) ? (
              <Carousel.Item onClick={handleClick} key={project.id}>
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
            ) : (
              <PublicProjects />
            )
          })}
        </Carousel>
      </div>
    )
  }
}

export default withRouter(AllProjects)
