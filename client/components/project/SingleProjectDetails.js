import {Button} from 'react-bootstrap'
import React, {useState, useEffect} from 'react'
import Tone from 'tone'
import {useCollection, useDocument} from 'react-firebase-hooks/firestore'
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

import {Message, Project} from '../../firestore/models'

export const SingleProjectDetails = ({docRef, history}) => {
  const projectDocRef = Project.findProjectQuery(docRef)
  const [projectQueryResult, loading, error] = useDocument(projectDocRef)
  const projectData = Project.fetchProjectData(projectQueryResult)

  // ANDRE!!
  // THIS CODE SHOULD BE MOVED TO YOUR CHAT COMPONENT, with "docRef" passed
  // as a prop
  // I PUT IT HERE FOR TESTING ONLY!!
  // THANKS! HOPE IT WORKS FOR YOU!!
  const messageCollectionQuery = Project.findProjectMessagesQuery(docRef)
  const [messageQueryResult, messagesLoading, messagesError] = useCollection(
    messageCollectionQuery
  )
  const messageData = Message.fetchAllMessagesData(messageQueryResult)

  if (messageQueryResult) {
    console.log('message Data, ordered by time (hopefully): ', messageData)
    // ANDRE. Notice that some messages will have empty e-mails and content.
    // Your component will have to ignore these (not display them)
    // Also notice that the timestamp is of time Timestamp. You can convert
    // this to a Date as follows:
    messageData.forEach((message, index) => {
      console.log(
        'message[',
        index,
        ']: timestamp: ',
        message.timestamp.toDate()
      )
    })
  }
  // ANDRE: notice that the messages are ordered from oldest (index 0)
  // to newest (index 9)... I think we can take advantage of that and
  // always update index 0 with our new messages (overwrite the oldest)
  // I wrote a message routine to do this. Pass it messageData[0].docRef
  // Note this is a HACK to test the chat!! I simply added a handler to the
  // chat button to post a message every time the chat button is pushed. Your
  // component will, of course, do something similar on its "Send" button
  // handler
  const send = async () => {
    console.log('trying to send a new message')
    await Message.send(messageData[0].docRef, {
      email: 'mike.wislek@gmail.com',
      content: 'Hi Andre. Hope this works for you'
    })
  }
  // I seeded the "Chris Can Juggle" project with the chat structure. If
  // you bring up the application on this project and push the "chat" button
  // AND look at Firestore, you should see the documents update...

  // END OF SPECIAL ANDRE MESSAGE!!

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
              <Button variant="secondary" onClick={send}>
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
      </div>
    )
  }
}
