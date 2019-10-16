import React, {useEffect} from 'react'
import {useCollection} from 'react-firebase-hooks/firestore'
import {Spinner} from 'react-bootstrap'

import {Message, Project} from '../../firestore/models'
import UserInput from './UserInput'
//let messagesFromDb = ['hello', 'goodbye', 'who is this?']

// ANDRE!!
// THIS CODE SHOULD BE MOVED TO YOUR CHAT COMPONENT, with "docRef" passed
// as a prop
// I PUT IT HERE FOR TESTING ONLY!!
// THANKS! HOPE IT WORKS FOR YOU!!

// ANDRE: notice that the messages are ordered from oldest (index 0)
// to newest (index 9)... I think we can take advantage of that and
// always update index 0 with our new messages (overwrite the oldest)
// I wrote a message routine to do this. Pass it messageData[0].docRef
// Note this is a HACK to test the chat!! I simply added a handler to the
// chat button to post a message every time the chat button is pushed. Your
// component will, of course, do something similar on its "Send" button
// handler

// I seeded the "Chris Can Juggle" project with the chat structure. If
// you bring up the application on this project and push the "chat" button
// AND look at Firestore, you should see the documents update...

// END OF SPECIAL ANDRE MESSAGE!!

const GroupChat = props => {
  const messageCollectionQuery = Project.findProjectMessagesQuery(props.docRef)
  const [messageQueryResult, messagesLoading, messagesError] = useCollection(
    messageCollectionQuery
  )
  let messageData = Message.fetchAllMessagesData(messageQueryResult)

  let messageRef
  //let messageRef = messageData[0].docRef
  // useEffect(
  //   () => {

  // )

  // onMessageWasSent(message) {
  //   let arr = this.state.messageList
  //   this.setState({
  //     messageList: [...arr, message]
  //   })
  // }

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
                <div className="sc-message--content received">
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
