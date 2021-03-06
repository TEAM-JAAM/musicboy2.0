/* eslint-disable complexity */
import {Button} from 'react-bootstrap'
import React, {useState, useEffect} from 'react'
import Tone from 'tone'
import {useCollection, useDocument} from 'react-firebase-hooks/firestore'
import {MdHome, MdChat, MdPlayArrow, MdSettings, MdStop} from 'react-icons/md'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Form from 'react-bootstrap/Form'
import Navbar from 'react-bootstrap/Navbar'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Spinner from 'react-bootstrap/Spinner'
import Tooltip from 'react-bootstrap/Tooltip'

import {Message, Project} from '../../firestore/models'
import {auth} from '../../firestore/db'
import SingleProjectSettings from './SingleProjectSettings'

import GroupChat from '../Chat/GroupChat'

let counter = 1

export const SingleProjectDetails = ({docRef, history}) => {
  const email = auth.currentUser.email
  const projectDocRef = Project.findProjectQuery(docRef)
  const [projectQueryResult, loading, error] = useDocument(projectDocRef)
  const projectData = Project.fetchProjectData(projectQueryResult)

  const messageCollectionQuery = Project.findProjectMessagesQuery(docRef)
  const [messageQueryResult, messagesLoading, messagesError] = useCollection(
    messageCollectionQuery
  )

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
        Tone.Transport.bpm.value = 2 * newTempo
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

  const [notification, showNotification] = useState(false)

  const [chatting, toggleChat] = useState(false)
  const handleChat = () => {
    if (chatting) {
      toggleChat(false)
    } else {
      toggleChat(true)
      showNotification(false)
    }
  }

  useEffect(
    () => {
      if (messageQueryResult) {
        console.log('NEW MESSAGE notif', notification)
        if (!chatting) {
          console.log('counter', counter)
          if (counter > 1) {
            showNotification(true)
          }
          counter++
          console.log('counter', counter)
        } else {
          showNotification(false)
        }
      }
    },
    [messageQueryResult]
  )
  const handleBack = () => {
    history.push('/home')
  }
  // modal settings show hide
  const [modalShow, setModalShow] = React.useState(false)

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
              overlay={<Tooltip>Home</Tooltip>}
            >
              <Button variant="secondary" onClick={handleBack}>
                <MdHome className="icon" />
              </Button>
            </OverlayTrigger>
          </ButtonGroup>
          <ButtonGroup size="sm" className="ml-5">
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
                placement="bottom"
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
                {notification ? (
                  <div className="sc-new-messages-count">!</div>
                ) : null}
              </Button>
            </OverlayTrigger>
            {projectData.members[0] === email && (
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Project settings...</Tooltip>}
              >
                <Button variant="secondary" onClick={() => setModalShow(true)}>
                  <MdSettings className="icon" />
                </Button>
              </OverlayTrigger>
            )}
            <SingleProjectSettings
              show={modalShow}
              onHide={() => setModalShow(false)}
              project={projectData}
              docref={projectDocRef}
            />
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
