import React, {Component} from 'react'
import Button from 'react-bootstrap/Button'

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
      return this.submitText(event)
    }
  }

  handleKeyUp(event) {
    const inputHasText =
      event.target.innerHTML.length !== 0 && event.target.innerText !== '\n'
    this.setState({inputHasText})
  }

  submitText(event) {
    event.preventDefault()
    const text = this.userInput.textContent
    if (text && text.length > 0) {
      // this.props.onSubmit({
      //   author: 'me',
      //   time: new Date(),
      //   data: {text}
      // })
      this.props.onSubmit(text)
      this.userInput.innerHTML = ''
    }
  }

  renderSend() {
    if (this.state.inputHasText) {
      return (
        <Button
          className="sc-user-input--button"
          type="submit"
          variant="primary"
          onClick={this.submitText.bind(this)}
        >
          Send
        </Button>
      )
    } else {
      return (
        <Button
          className="sc-user-input--button"
          type="submit"
          variant="secondary"
        >
          Send
        </Button>
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
        <div className="sc-user-input--button">{this.renderSend()}</div>
      </form>
    )
  }
}

export default UserInput
