import React, {Component} from 'react'
import UserInput from './UserInput'
import Header from './Header'

let Messages = ['hello', 'goodbye', 'who is this?']

class ChatWindow extends Component {
  constructor(props) {
    super(props)
  }

  onUserInputSubmit(message) {
    this.props.onUserInputSubmit(message)
  }

  onFilesSelected(filesList) {
    this.props.onFilesSelected(filesList)
  }

  render() {
    let messageList = this.props.messageList || []
    let temp = true
    let classList = ['sc-chat-window', temp ? 'opened' : 'closed']
    return (
      <div className={classList.join(' ')}>
        <Header teamName="Rock City" imageUrl="../../../public/jaamlogo.png" />
        <div>
          {Messages.map((message, i) => {
            return <li key={i}>message</li>
          })}
        </div>
        <UserInput
          onSubmit={this.onUserInputSubmit.bind(this)}
          onFilesSelected={this.onFilesSelected.bind(this)}
          showEmoji={this.props.showEmoji}
        />
      </div>
    )
  }
}

export default ChatWindow
