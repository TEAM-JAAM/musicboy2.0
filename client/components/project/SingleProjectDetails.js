import {Button} from 'react-bootstrap'
import React, {useState, useEffect} from 'react'
import Tone from 'tone'
import {useDocument} from 'react-firebase-hooks/firestore'
import {
  MdArrowBack,
  MdChat,
  MdPlayArrow,
  MdSettings,
  MdStop
} from 'react-icons/md'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Form from 'react-bootstrap/Form'
import Navbar from 'react-bootstrap/Navbar'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Spinner from 'react-bootstrap/Spinner'
import Tooltip from 'react-bootstrap/Tooltip'
import {Project} from '../../firestore/models'

import GroupChat from '../Chat/GroupChat'

export const SingleProjectDetails = ({docRef, history}) => {
  const projectDocRef = Project.findProjectQuery(docRef)
  const [projectQueryResult, loading, error] = useDocument(projectDocRef)
  const projectData = Project.fetchProjectData(projectQueryResult)

  // Tempo-related configuration...
  const [tempo, setTempo] = useState(0)
  const handleTempoChange = event => {
    setTempo(event.target.value)
  }
  const saveTempo = async event => {
    event.preventDefault()
    console.log('will try to save new tempo: ', tempo)
    const project = Project.fromDocRef(projectDocRef)
    await project.update({
      tempo: tempo
    })
  }
  useEffect(
    () => {
      if (projectQueryResult) {
        const newTempo = projectQueryResult.data().tempo
        setTempo(newTempo)
        Tone.Transport.bpm.value = newTempo
      }
    },
    [projectQueryResult]
  )

  useEffect(() => {
    return () => {
      Tone.Transport.stop()
      Tone.Transport.cancel()
    }
  }, [])

  const [playing, setPlaying] = useState(false)
  const handlePlay = () => {
    if (playing) {
      Tone.Transport.stop()
      Tone.Transport.on('stop', () => {
        let tempCol = document.querySelectorAll('td.zoom')
        tempCol.forEach(col => {
          col.removeAttribute('class', 'zoom')
        })
      })
      setPlaying(false)
    } else {
      Tone.Transport.start()
      setPlaying(true)
    }
  }

  const [chatting, toggleChat] = useState(false)
  const handleChat = () => {
    if (chatting) {
      toggleChat(false)
    } else {
      toggleChat(true)
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
      <MdStop className="icon" />
    ) : (
      <MdPlayArrow className="icon" />
    )

    return (
      <div>
        <Navbar className="project-details-nav">
          <ButtonGroup size="sm">
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Back</Tooltip>}
            >
              <Button variant="secondary" onClick={handleBack}>
                <MdArrowBack className="icon" />
              </Button>
            </OverlayTrigger>
          </ButtonGroup>
          <ButtonGroup size="sm" className="ml-1">
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Play/Stop</Tooltip>}
            >
              <Button variant="secondary" onClick={handlePlay}>
                {playButton}
              </Button>
            </OverlayTrigger>
          </ButtonGroup>
          <Navbar.Text className="ml-auto mr-auto">
            {projectData.name}
          </Navbar.Text>
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
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Set tempo</Tooltip>}
            >
              <Button
                className="ml-1"
                size="sm"
                type="submit"
                variant="secondary"
              >
                <small>SET TEMPO</small>
              </Button>
            </OverlayTrigger>
          </Form>
          <ButtonGroup size="sm" className="ml-3">
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Chat with a member</Tooltip>}
            >
              <Button variant="secondary" onClick={handleChat}>
                <MdChat className="icon" />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Project settings...</Tooltip>}
            >
              <Button variant="secondary" onClick={handlePlay}>
                <MdSettings className="icon" />
              </Button>
            </OverlayTrigger>
          </ButtonGroup>
        </Navbar>
        {chatting ? (
          <div>
            <GroupChat
              docRef={docRef}
              handleClose={handleChat}
              isOpen={chatting}
              projectName={projectData.name}
            />
          </div>
        ) : null}
      </div>
    )
  }
}
