import React, {Component} from 'react'
//import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
//import {logout} from '../store'
import {db, auth} from '../firestore/db'
import history from '../history'

export default class Navbar extends Component {
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
    this.state = {}
  }
  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        history.push('/home')
        this.setState({})
        db
          .collection('projects')
          .get()
          .then(
            snapshot => {
              console.log(snapshot.docs)
            },
            err => {
              console.log(err.message)
            }
          )
      } else {
        console.log('user logged out')
        history.push('/login')
        this.setState({})
      }
    })
  }

  handleClick() {
    auth.signOut()
    history.push('/login')
    this.setState({})
  }

  render() {
    return (
      <div>
        <h1>ITS JAMMIN' TIME</h1>
        <nav>
          {auth.currentUser ? (
            <div>
              <Link to="/home">Home</Link>
              <Link to="/play">Jaam Out</Link>
              <a href="#" onClick={this.handleClick}>
                Logout
              </a>
            </div>
          ) : (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
              <Link to="/play">Jaam Out</Link>
            </div>
          )}
        </nav>
        <hr />
      </div>
    )
  }
}
