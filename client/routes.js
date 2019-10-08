import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'
import {UserHome} from './components'
import {me} from './store'
import AllInstruments from './components/AllInstruments'
import {auth} from './firestore/db'

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route path="/play" component={AllInstruments} />
        {auth.currentUser && (
          <Switch>
            <Route path="/home" component={UserHome} />
          </Switch>
        )}
      </Switch>
    )
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect()(Routes))
