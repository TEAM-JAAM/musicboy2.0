import React, {useState} from 'react'
import {useCollection} from 'react-firebase-hooks/firestore'
import {MdPublic, MdAccountCircle, MdHome} from 'react-icons/md'
import {FiLogOut} from 'react-icons/fi'
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
import AllProjects from './AllProjects'

// need projects from database

const NavBarToggle = props => {
  const {email, history, uid} = props
  console.log('hellolllolololoooooo ', history)

  const [value, setValue] = useState(1)
  const handleChange = val => {
    setValue(val)
    if (value === 2) {
      console.log('VALUEEE: ', value)
      console.log('Valllll: ', val)
      history.push('/public')
    }
    if (value === 3) {
      history.push('/myaccount')
    }
    if (value === 4) {
      history.push('/home')
    } else history.push('/home')
  }

  return (
    <div>
      <div className="center">
        <Row className="justify-content-center mb-2 mt-5">
          <ToggleButtonGroup
            type="radio"
            value={value}
            name="projectToggle"
            onChange={handleChange}
          >
            <ToggleButton key={1} variant="outline-dark" value={1}>
              <OverlayTrigger placement="top" overlay={<Tooltip>Home</Tooltip>}>
                <MdHome className="icon" />
              </OverlayTrigger>
            </ToggleButton>
            <ToggleButton key={2} variant="outline-dark" value={2}>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Public Sessions</Tooltip>}
              >
                <MdPublic className="icon" />
              </OverlayTrigger>
            </ToggleButton>
            <ToggleButton key={3} variant="outline-dark" value={3}>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>My Account</Tooltip>}
              >
                <MdAccountCircle className="icon" />
              </OverlayTrigger>
            </ToggleButton>
            <ToggleButton key={4} variant="outline-dark" value={4}>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Log Out</Tooltip>}
              >
                <FiLogOut className="icon" />
              </OverlayTrigger>
            </ToggleButton>
          </ToggleButtonGroup>
        </Row>
      </div>
    </div>
  )
}

export default withRouter(NavBarToggle)
