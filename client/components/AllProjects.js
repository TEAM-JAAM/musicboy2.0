import React, {useState} from 'react'
import {useCollection} from 'react-firebase-hooks/firestore'
import {MdGroup, MdAccountCircle, MdHome, MdMusicNote} from 'react-icons/md'
import {auth} from '../firestore/db'
import {
  ToggleButtonGroup,
  Carousel,
  Row,
  ToggleButton,
  Spinner,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap'
import {Link, withRouter} from 'react-router-dom'
import PublicProjects from './PublicProjects'
import UserProjectsList from './UserProjectsList'
import {Project} from '../firestore/models'
import Error from './Error'

// need projects from database

const AllProjects = props => {
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

  // toggle buttons
  const [value, setValue] = useState(1)
  const viewChanger = project => {
    if (value === 1) {
      return project.members.includes(email)
    } else {
      return project.permissions === 'Public'
    }
  }
  const handleChange = val => {
    setValue(val)
    if (val === 1) {
      history.push('/home')
    }
    if (val === 2) {
      history.push('/public')
    }
    if (val === 3) {
      history.push('/myaccount')
    }
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
      <div>
        <div className="center">
          <Row className="justify-content-center mb-4 mt-3">
            <ToggleButtonGroup
              type="radio"
              value={value}
              name="projectToggle"
              onChange={handleChange}
            >
              <ToggleButton key={1} variant="outline-dark" value={1}>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Home</Tooltip>}
                >
                  <MdHome className="icon" />
                </OverlayTrigger>
              </ToggleButton>
              <ToggleButton key={2} variant="outline-dark" value={2}>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Public Sessions</Tooltip>}
                >
                  <MdGroup className="icon" />
                </OverlayTrigger>
              </ToggleButton>
              <ToggleButton key={3} variant="outline-dark" value={3}>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>My Account</Tooltip>}
                >
                  <MdAccountCircle className="icon" />
                </OverlayTrigger>
              </ToggleButton>
              <ToggleButton key={4} variant="outline-dark" value={4}>
                <MdMusicNote className="icon" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Row>
        </div>

        {/* {value === 4 ? (
          <Error />
        ) : (
          <Carousel
            activeIndex={index}
            direction={direction}
            onSelect={handleSelect}
            interval={3000}
          >
            {projects.map(project => {
              return viewChanger(project) ? (
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
              ) : null
            })}
          </Carousel>
        )} */}
      </div>
    )
  }
}

export default withRouter(AllProjects)
