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
import Button from 'react-bootstrap/Button'
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
            <Form.Group className="m-0" controlId="formTempo">
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
            <Button
              className="ml-1"
              size="sm"
              type="submit"
              variant="secondary"
            >
              <small>SET TEMPO</small>
            </Button>
          </Form>
          <ButtonGroup size="sm" className="ml-3">
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
