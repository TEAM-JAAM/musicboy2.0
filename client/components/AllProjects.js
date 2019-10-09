import React, {useState} from 'react'
import {ToggleButtonGroup, Carousel, Row, ToggleButton} from 'react-bootstrap'
import {withRouter} from 'react-router-dom'
// need projects from database

const AllProjects = props => {
  const {email} = props

  const projects = [
    {
      id: 0,
      members: ['Theo', email.slice(0, email.indexOf('@')), 'Mike'],
      max: 10,
      name: 'My Project',
      image: '🎸'
    },
    {
      id: 1,
      members: [email.slice(0, email.indexOf('@'))],
      max: 7,
      name: 'Weeee',
      image: '🎷'
    },
    {
      id: 2,
      members: [
        'Theo',
        'Andre',
        'Jake',
        'Andrea',
        email.slice(0, email.indexOf('@'))
      ],
      max: 5,
      name: 'Theo Is Making A Game',
      image: '🎹'
    },
    {
      id: 3,
      members: ['Theo'],
      max: 1,
      name: '1234',
      image: '🎺'
    },
    {
      id: 4,
      members: ['Chris', 'Theo'],
      max: 5,
      name: 'Chris Can Juggle Anything',
      image: '🎻'
    },
    {
      id: 5,
      members: ['Jake', 'Mike', 'Andrea', 'Andre', 'Theo'],
      max: 10,
      name: 'JavaScript',
      image: '🎤'
    },
    {
      id: 6,
      members: [email.slice(0, email.indexOf('@'))],
      max: 1,
      name: 'My Email is in the Array of Band Members',
      image: '🎸'
    },
    {
      id: 7,
      members: [email.slice(0, email.indexOf('@'))],
      max: 3,
      name: 'If I Could Turn Back Time',
      image: '🎤'
    },
    {
      id: 8,
      members: [email.slice(0, email.indexOf('@'))],
      max: 5,
      name: 'Best Musicians in the WORLD',
      image: '🎻'
    }
  ]
  console.log(projects)
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
    console.log(props.history)
  }

  // toggle buttons
  const [value, setValue] = useState(1)
  const viewChanger = project => {
    if (value === 1) {
      return project.members.includes(email.slice(0, email.indexOf('@')))
    } else {
      return !project.members.includes(email.slice(0, email.indexOf('@')))
    }
  }
  const handleChange = val => {
    setValue(val)
  }

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
        interval={3000}
      >
        {projects.map(project => {
          return viewChanger(project) ? (
            <Carousel.Item key={project.id}>
              <img
                className="d-block w-100"
                src={`https://imgholder.ru/2500x800/8493a8/adb9ca&text=${
                  project.name
                }&font=kelson`}
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
    </div>
  )
}

export default withRouter(AllProjects)
