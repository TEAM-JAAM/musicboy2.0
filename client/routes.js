import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import {SingleProject, UserHome} from './components'
import {auth} from './firestore/db'

class Routes extends Component {
  render() {
    console.log('auth.currentUser: ', auth.currentUser)
    return (
      <Switch>
        {auth.currentUser && (
          <Switch>
            <Route path="/home" component={UserHome} />
            <Route path="/projects/:docRef" component={SingleProject} />
          </Switch>
        )}
      </Switch>
    )
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect()(Routes))
