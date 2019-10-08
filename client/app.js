import React, {Component} from 'react'
import {db} from './firestore/db'
import {Navbar} from './components'
import Routes from './routes'

class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <Routes />
      </div>
    )
  }
}

export default App
