import React, {useState} from 'react'
import {MdPublic, MdAccountCircle, MdHome, MdMusicNote} from 'react-icons/md'
import {FiLogOut} from 'react-icons/fi'
import {
  Alert,
  ToggleButtonGroup,
  Row,
  ToggleButton,
  OverlayTrigger,
  Tooltip,
  Button
} from 'react-bootstrap'
import {withRouter} from 'react-router-dom'
import {auth} from '../firestore/db'

// need projects from database

const AllProjects = props => {
  const {history} = props

  // toggle buttons
  const [value, setValue] = useState(1)
  const [show, setShow] = useState(false)

  const handleAlert = () => {
    setShow(true)
  }
  const handleClose = () => {
    setShow(false)
  }

  const handleLogOut = () => {
    handleClose()
    auth.signOut()
    history.push('/login')
  }

  const handleChange = val => {
    setValue(val)
    if (val === 1) {
      handleClose()
      history.push('/home')
    }
    if (val === 2) {
      handleClose()
      history.push('/public')
    }
    if (val === 3) {
      handleClose()
      history.push('/myaccount')
    }
  }

  return (
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
              <MdPublic className="icon" />
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
          <ToggleButton
            key={4}
            variant="outline-dark"
            value={4}
            onClick={handleAlert}
          >
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Log Out</Tooltip>}
            >
              <FiLogOut className="icon" />
            </OverlayTrigger>
          </ToggleButton>
        </ToggleButtonGroup>
      </Row>
      <Alert show={show} variant="danger" className="text-center">
        <Alert.Heading>Are you sure you want to logout?</Alert.Heading>

        <div className="d-flex justify-content-center">
          <Button onClick={handleLogOut} variant="danger">
            Logout
          </Button>
          <Button onClick={handleClose} variant="secondary">
            Close
          </Button>
        </div>
      </Alert>

      {/* {!show && <Button onClick={() => setShow(true)}>Show Alert</Button>} */}
    </div>
  )
}

export default withRouter(AllProjects)
