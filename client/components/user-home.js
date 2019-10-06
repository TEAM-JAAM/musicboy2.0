import React, {Component} from 'react'
import {auth} from '../firestore/db'

export default class UserHome extends Component {
  render() {
    const email = auth.currentUser.email
    return (
      <div>
        <h3>Welcome, {email}</h3>
      </div>
    )
  }
}
