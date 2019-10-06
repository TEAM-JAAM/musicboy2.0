import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'
import {Login, Signup, UserHome} from './components'
import {me} from './store'
import AllInstruments from './components/AllInstruments'
import {auth} from './firestore/db'

/**
 * COMPONENT
 */
class Routes extends Component {
  // componentDidMount() {
  //   auth.onAuthStateChanged(user => {
  //     if (user) {
  //       console.log('user logged in: ', user)
  //       //history.push('/home')
  //       //this.setState({})
  //     } else {
  //       console.log('user logged out')
  //       //history.push('/login')
  //     }
  //   })
  // }

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
