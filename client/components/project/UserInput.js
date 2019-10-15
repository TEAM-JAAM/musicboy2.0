import PropTypes from 'prop-types'
import React, {Component} from 'react'
// import SendIcon from './icons/SendIcon'

// import PopupWindow from './popups/PopupWindow'

class UserInput extends Component {
  constructor() {
    super()
    this.state = {
      inputActive: false,
      inputHasText: false
    }
  }

  handleKeyDown(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      return this._submitText(event)
    }
  }

  handleKeyUp(event) {
    const inputHasText =
      event.target.innerHTML.length !== 0 && event.target.innerText !== '\n'
    this.setState({inputHasText})
  }

  _submitText(event) {
    event.preventDefault()
    const text = this.userInput.textContent
    if (text && text.length > 0) {
      this.props.onSubmit({
        author: 'me',
        type: 'text',
        data: {text}
      })
      this.userInput.innerHTML = ''
    }
  }

  _renderSendOrFileIcon() {
    if (this.state.inputHasText) {
      return (
        <div className="sc-user-input--button">
          <button onClick={this._submitText.bind(this)}>Send</button>
        </div>
      )
    }
  }

  render() {
    const {inputActive} = this.state
    return (
      <form className={`sc-user-input ${inputActive ? 'active' : ''}`}>
        <div
          role="button"
          tabIndex="0"
          onFocus={() => {
            this.setState({inputActive: true})
          }}
          onBlur={() => {
            this.setState({inputActive: false})
          }}
          ref={e => {
            this.userInput = e
          }}
          onKeyDown={this.handleKeyDown.bind(this)}
          onKeyUp={this.handleKeyUp.bind(this)}
          contentEditable="true"
          placeholder="Write a reply..."
          className="sc-user-input--text"
        />
        <div className="sc-user-input--buttons">
          <div className="sc-user-input--button" />
        </div>
      </form>
    )
  }
}

export default UserInput
