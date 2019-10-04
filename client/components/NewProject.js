import React from 'react'

export default class NewProject extends React.Component {
  constructor() {
    super()
    this.state = {
      text: ''
    }
  }
  render() {
    return (
      <div>
        <form
          onSubmit={() => {
            event.preventDefault()
            console.log('this should create a firebase instance one day')
          }}
        >
          <input
            type="text"
            placeholder="this should create a firebase instance one day"
          />
          <button type="submit">Let's Jaam!!</button>
        </form>
      </div>
    )
  }
}
