import React, {Component} from 'react'

let Messages = ['hello', 'goodbye', 'who is this?']

class ChatWindow extends Component {
  render() {
    let messageList = this.props.messageList || []
    //let messageList = ['hello', 'goodbye', 'who is this?']
    let classList = ['sc-chat-window', this.props.isOpen ? 'opened' : 'closed']
    return (
      <div className={classList.join(' ')}>
        <div className="sc-header">
          <img
            className="sc-header--img"
            src="https://cdn3.iconfinder.com/data/icons/speech-bubble-2/100/Group-512.png"
            alt=""
          />
          <div className="sc-header--team-name">
            {this.props.projectName} Group Chat
          </div>
          <div
            className="sc-header--close-button"
            onClick={this.props.handleClose}
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
                <div className="sc-message--text">{message}</div>
              </div>
            </div>
          ))}
        </div>
        <UserInput />
      </div>
    )
  }
}

export default ChatWindow
