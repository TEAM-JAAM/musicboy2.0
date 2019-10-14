import {Button} from 'react-bootstrap'
import {TextButton, Dial} from 'react-nexusui'
import Nexus from 'nexusui'
import React, {useState, useEffect} from 'react'
import Tone from 'tone'
import {useDocument} from 'react-firebase-hooks/firestore'
import {
  MdAccessTime,
  MdArrowBack,
  MdChat,
  MdPlayArrow,
  MdPause,
  MdSettings
} from 'react-icons/md'

import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Form from 'react-bootstrap/Form'
import Navbar from 'react-bootstrap/Navbar'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Spinner from 'react-bootstrap/Spinner'

import {Project} from '../../firestore/models'

export const SingleProjectDetails = ({docRef, history}) => {
  const projectDocRef = Project.findProjectQuery(docRef)
  const [projectQueryResult, loading, error] = useDocument(projectDocRef)
  const project = Project.fetchProjectData(projectQueryResult)

  // Tempo-related configuration...
  const [tempo, setTempo] = useState(0)
  const handleTempoChange = event => {
    console.log('got tempo change: ', event.target.value)
    setTempo(event.target.value)
  }
  const saveTempo = event => {
    event.preventDefault()
    console.log('will try to save new tempo: ', tempo)
  }
  useEffect(
    () => {
      if (projectQueryResult) {
        const newTempo = projectQueryResult.data().tempo
        setTempo(newTempo)
      }
    },
    [projectQueryResult]
  )

  useEffect(() => {
    return () => {
      Tone.Transport.stop()
      Tone.Transport.cancel()
    }
  })

  const [playing, setPlaying] = useState(false)
  const handlePlay = () => {
    if (playing) {
      Tone.Transport.stop()
      setPlaying(false)
    } else {
      Tone.Transport.start()
      setPlaying(true)
    }
  }

  const handleBack = () => {
    history.goBack()
  }

  if (error) throw new Error('FATAL: firestore error encountered')
  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="align-self-center sr-only">Loading...</span>
      </Spinner>
    )
  }
  if (projectQueryResult) {
    const playButton = playing ? (
      <MdPause className="icon" />
    ) : (
      <MdPlayArrow className="icon" />
    )

    return (
      <div>
        {/* <h1>Single Project Details</h1>
        <p>project.name: {project.name}</p>
        <p>project.members: {project.members.join(', ')}</p>
        <p>project.emoji: {project.emoji}</p>
        <p>project.maxMembers: {project.max}</p>
        <p>project.permissions: {project.permissions}</p>
        <p>project.tempo: {project.tempo}</p>
        <div>
          <Dial
            size={[100, 100]}
            interaction="radial"
            onChange={console.log}
            value={Math.random()}
            min={0}
            max={10}
          />
        </div>
        <br />
        <Button
          variant="success"
          onClick={() => {
            Tone.Transport.start()
          }}
        >
          Play
        </Button>
        <Button
          variant="warning"
          onClick={() => {
            Tone.Transport.stop()
          }}
        >
          Stop
        </Button> */}
        <Navbar className="project-details-nav">
          <ButtonGroup size="sm">
            <Button variant="secondary" onClick={handleBack}>
              <MdArrowBack className="icon" />
            </Button>
          </ButtonGroup>
          <ButtonGroup size="sm" className="ml-1">
            <Button variant="secondary" onClick={handlePlay}>
              {playButton}
            </Button>
          </ButtonGroup>
          <Navbar.Text className="ml-auto mr-auto">{project.name}</Navbar.Text>
          <Form inline onSubmit={saveTempo}>
            <Form.Group controlId="formTempo">
              <OverlayTrigger
                trigger="focus"
                placement="top"
                overlay={
                  <Popover id="popover-positioned-top">
                    <Popover.Content>
                      Tempo: <strong>{tempo} bpm</strong>
                    </Popover.Content>
                  </Popover>
                }
              >
                <Form.Control
                  type="range"
                  min="50"
                  max="200"
                  onChange={handleTempoChange}
                  step="5"
                  value={tempo}
                />
              </OverlayTrigger>
            </Form.Group>
            <Button size="sm" type="submit" variant="secondary">
              <MdAccessTime className="icon" />
            </Button>
          </Form>
          <ButtonGroup size="sm" className="ml-1">
            <Button variant="secondary" onClick={handlePlay}>
              <MdChat className="icon" />
            </Button>
            <Button variant="secondary" onClick={handlePlay}>
              <MdSettings className="icon" />
            </Button>
          </ButtonGroup>
        </Navbar>
      </div>
    )
  }
}
