import React from 'react'

// if public => type: fun, beginning, intermediate, professional
// invite: my friends? or input email?
// template: blank, percussive, orchestra, or synths

export default class NewProject extends React.Component {
  constructor() {
    super()
    this.state = {
      title: '',
      image: '🎵',
      privacy: false,
      invite: [],
      template: ''
    }
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(event) {
    console.log('name ', event.target.name)
    console.log('value ', event.target.value)
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  handleSubmit() {
    event.preventDefault()
    this.setState({
      title: '',
      image: '🎵',
      privacy: false,
      invite: [],
      template: ''
    })
  }
  render() {
    return (
      <div className="form-container">
        <form onChange={this.handleChange} onSubmit={this.handleSubmit}>
          <div className="form-options">
            <label htmlFor="title">Title</label>
            <input
              name="title"
              type="text"
              placeholder="Project Name"
              onChange={this.handleChange}
            />
          </div>
          <div className="form-options">
            <label htmlFor="image">Image</label>
            <select name="image" onChange={this.handleChange}>
              <option value="🎵">🎵</option>
              <option value="🎸">🎸</option>
              <option value="🎷">🎷</option>
              <option value="🎹">🎹</option>
              <option value="🎻">🎻</option>
              <option value="🎤">🎤</option>
              <option value="🎺">🎺</option>
              <option value="🎧">🎧</option>
              <option value="🥁">🥁</option>
            </select>
          </div>
          <div className="form-options">
            <label htmlFor="public">Public</label>
            <input type="radio" name="privacy" id="public" value={false} />
          </div>
          <div className="form-options">
            <label htmlFor="hidden">Hidden</label>
            <input type="radio" name="privacy" id="hidden" value={true} />
          </div>
          <button type="submit">Let's Jaam!!</button>
        </form>
      </div>
    )
  }
}
