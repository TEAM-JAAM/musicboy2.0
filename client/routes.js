import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import {Login, Signup, UserHome} from './components'
import AllInstruments from './components/AllInstruments'
import {auth} from './firestore/db'

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/play" component={AllInstruments} />
        {auth.currentUser && (
          <Switch>
            <Route path="/home" component={UserHome} />
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
