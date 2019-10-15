import React, {Component} from 'react'
import {useCollection} from 'react-firebase-hooks/firestore'
import {Spinner, Container, Col, Row} from 'react-bootstrap'
import {Project} from '../../firestore/models'
import ChatWindow from './ChatWindow'
import {useDocument} from 'react-firebase-hooks/firestore'

export const GroupChat = ({docRef}) => {
  //   const chatCollectionRef = Project.findProjectChatQuery(docRef)
  //   const [chatQueryResult, loading, error] = useCollection(chatCollectionRef)

  const chatCollectionRef = Project.findProjectChatQuery(docRef)
  const [chatQueryResult, loading, error] = useCollection(chatCollectionRef)
  const chat = Project.fetchChatData(chatQueryResult)

  if (error) throw new Error('FATAL: firestore error encountered')
  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="align-self-center sr-only">Loading...</span>
      </Spinner>
    )
  }
  if (chatQueryResult) {
    console.log('chatDocDATA  - chat ', chat[0])
    console.log('chatDocDATA  - chat ', chat[0].data())
    return (
      <div id="sc-launcher">
        <ChatWindow
          messageList={['hello']}
          onUserInputSubmit={this.props.onMessageWasSent}
          agentProfile={this.props.agentProfile}
          showEmoji={this.props.showEmoji}
        />
      </div>
    )
  }
}

export default GroupChat
