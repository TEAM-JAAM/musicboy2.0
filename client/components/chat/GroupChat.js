import React, {useEffect} from 'react'
import {useCollection} from 'react-firebase-hooks/firestore'
import {Spinner} from 'react-bootstrap'
import {auth} from '../../firestore/db'
import {Message, Project} from '../../firestore/models'
import UserInput from './UserInput'

const GroupChat = props => {
  const messageCollectionQuery = Project.findProjectMessagesQuery(props.docRef)
  const [messageQueryResult, messagesLoading, messagesError] = useCollection(
    messageCollectionQuery
  )
  let messageData = Message.fetchAllMessagesData(messageQueryResult)

  let messageRef

  let me = auth.currentUser.email

  useEffect(
    () => {
      if (messageQueryResult) {
        console.log('NEW MESSAGE')
        messageData = Message.fetchAllMessagesData(messageQueryResult)
        messageRef = messageData[0].docRef
      }
    },
    [messageQueryResult]
  )

  if (messagesError) throw new Error('FATAL: firestore error encountered')
  if (messagesLoading && props.isOpen) {
    return (
      <Spinner animation="border" role="status">
        <span className="align-self-center sr-only">Loading...</span>
      </Spinner>
    )
  }

  if (messageQueryResult) {
    console.log('message Data, ordered by time (hopefully): ', messageData)
    messageRef = messageData[0].docRef
    messageData.forEach((message, index) => {
      console.log(
        'message[',
        index,
        ']: timestamp: ',
        message.timestamp.toDate()
      )
    })

    let messageList = messageData || []
    let classList = ['sc-chat-window', props.isOpen ? 'opened' : 'closed']
    return (
      <div id="sc-launcher">
        <div className={classList.join(' ')}>
          <div className="sc-header">
            <img
              className="sc-header--img"
              src="https://cdn3.iconfinder.com/data/icons/speech-bubble-2/100/Group-512.png"
              alt=""
            />
            <div className="sc-header--team-name">
              {props.projectName} Group Chat
            </div>
            <div
              className="sc-header--close-button"
              onClick={props.handleClose}
            >
              <img
                src="https://icon-library.net/images/close-button-icon/close-button-icon-23.jpg"
                alt=""
              />
            </div>
          </div>

          <div className="sc-message-list">
            {messageList.map((message, i) => (
              <div className="sc-message" key={i}>
                <div
                  className={
                    me === message.email
                      ? 'sc-message--content sent'
                      : 'sc-message--content received'
                  }
                >
                  <div
                    className="sc-message--avatar"
                    style={{
                      backgroundImage: `url(
                      ${'https://cdn3.iconfinder.com/data/icons/social-messaging-ui-color-line/254000/01-512.png'}
                    )`
                    }}
                  />
                  <div className="sc-message--text">
                    {message.content}
                    <div className="sc-message--small-text">
                      <span>From: {message.email}</span>
                    </div>
                    <div className="sc-message--small-text">
                      <span>
                        Received:{' '}
                        {message.timestamp
                          .toDate()
                          .toString()
                          .slice(0, 24)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <UserInput messageDocRef={messageRef} />
        </div>
      </div>
    )
  }
}

export default GroupChat
