import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import {SingleProject, UserHome, Err} from './components'
import {auth} from './firestore/db'
import PublicProjects from './components/PublicProjects'
import UserProjectsList from './components/UserProjectsList'

class Routes extends Component {
  render() {
    console.log('auth.currentUser: ', auth.currentUser)
    return (
      <Switch>
        {auth.currentUser && (
          <Switch>
            <Route path="/public" component={PublicProjects} />
            <Route path="/myaccount" component={UserProjectsList} />
            <Route path="/home" component={UserHome} />
            <Route path="/projects/:docRef" component={SingleProject} />
            <Route path="/jammed" component={Err} />
          </Switch>
        )}
      </Switch>
    )
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect()(Routes))
