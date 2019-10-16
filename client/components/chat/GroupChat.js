import React, {Component} from 'react'
import {useCollection} from 'react-firebase-hooks/firestore'
import {Spinner, Container, Col, Row} from 'react-bootstrap'
import {Project} from '../../firestore/models'
import ChatWindow from './ChatWindow'

let messagesFromDb = ['hello', 'goodbye', 'who is this?']

class GroupChat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messageList: messagesFromDb
    }
    this.onMessageWasSent = this.onMessageWasSent.bind(this)
  }

  onMessageWasSent(message) {
    let arr = this.state.messageList
    this.setState({
      messageList: [...arr, message]
    })
  }

  render() {
    return (
      <div id="sc-launcher">
        <ChatWindow
          messageList={this.state.messageList}
          handleClose={this.props.handleClose}
          isOpen={this.props.isOpen}
          projectName={this.props.projectName}
          onUserInputSubmit={this.onMessageWasSent}
        />
      </div>
    )
  }
}

export default GroupChat
