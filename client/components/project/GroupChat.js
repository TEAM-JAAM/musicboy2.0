import React, {Component} from 'react'
import {useCollection} from 'react-firebase-hooks/firestore'
import {Spinner, Container, Col, Row} from 'react-bootstrap'
import {Project} from '../../firestore/models'
import ChatWindow from './ChatWindow'
import {useDocument} from 'react-firebase-hooks/firestore'

export const GroupChat = () => {
  //   if (error) throw new Error('FATAL: firestore error encountered')
  //   if (loading) {
  //     return (
  //       <Spinner animation="border" role="status">
  //         <span className="align-self-center sr-only">Loading...</span>
  //       </Spinner>
  //     )
  //   }

  return (
    <div id="sc-launcher">
      <ChatWindow
        messageList={['hello', 'goodbye', 'who is this?']}
        // onUserInputSubmit={this.props.onMessageWasSent}
      />
    </div>
  )
}

export default GroupChat
