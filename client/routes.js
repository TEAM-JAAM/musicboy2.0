import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import {Login, Signup, UserHome} from './components'
import AllInstruments from './components/AllInstruments'
import {auth} from './firestore/db'
import SingleProject from './components/single-project/SingleProject'

class Routes extends Component {
  render() {
    console.log('auth.currentUser: ', auth.currentUser)
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        {auth.currentUser && (
          <Switch>
            <Route path="/home" component={UserHome} />
            <Route path="/projects/:docRef" component={SingleProject} />
            <Route path="/play" component={AllInstruments} />
          </Switch>
        )}
        <Route component={Login} />
      </Switch>
    )
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect()(Routes))
