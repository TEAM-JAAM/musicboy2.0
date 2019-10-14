import React, {Component} from 'react'
import {Navbar} from './components'
import Routes from './routes'
import AllProjects from './components/AllProjects'

class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        {/* <AllProjects /> */}
        <Routes />
      </div>
    )
  }
}

export default App
