import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {db, auth, provider} from '../firestore/db'
import history from '../history'
import {Modal, Button, Row} from 'react-bootstrap'
import AllProjects from './AllProjects'

export default class Navbar extends Component {
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.googleSignIn = this.googleSignIn.bind(this)
    this.state = {
      popUp: '',
      show: false
    }
  }
  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        history.push('/home')
        this.setState({show: false})
        db
          .collection('projects')
          .get()
          .then(
            snapshot => {
              console.log('navbar')
            },
            err => {
              console.log(err.message)
            }
          )
      } else {
        console.log('user logged out')
        this.setState({show: false})
      }
    })
  }

  handleSubmit(evt) {
    evt.preventDefault()
    const formName = evt.target.name
    const email = evt.target.email.value
    const password = evt.target.password.value

    if (formName === 'Signup') {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then(cred => {
          return db
            .collection('users')
            .doc(cred.user.uid)
            .set({
              email: cred.user.email
            })
        })
        .catch(error => {
          alert(error)
          document.getElementById('mainInput').reset()
        })
    } else if (formName === 'Login') {
      auth.signInWithEmailAndPassword(email, password).catch(error => {
        alert(error)
        document.getElementById('mainInput').reset()
      })
    }
  }

  googleSignIn() {
    auth
      .signInWithPopup(provider)
      .then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken
        // The signed-in user info.
        var user = result.user
        return db
          .collection('users')
          .doc(user.uid)
          .set({
            email: user.email
          })
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
        // The email of the user's account used.
        var email = error.email
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential
        alert(error)
      })
  }

  handleClose() {
    this.setState({show: false})
  }

  handleClick() {
    auth.signOut()
    history.push('/login')
    this.setState({show: false})
  }

  render() {
    return (
      <div>
        {auth.currentUser ? (
          <AllProjects />
        ) : (
          <Row className="justify-content-center mt-3">
            <Button
              className="m-2"
              size="lg"
              variant="primary"
              onClick={() => {
                this.setState({
                  popUp: 'Login',
                  show: true
                })
              }}
            >
              <a>Login</a>
            </Button>
            <Button
              className="m-2"
              size="lg"
              variant="primary"
              onClick={() => {
                this.setState({
                  popUp: 'Signup',
                  show: true
                })
              }}
            >
              <a>Sign Up</a>
            </Button>
          </Row>
        )}
        {this.state.popUp ? (
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{this.state.popUp}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <form
                  onSubmit={this.handleSubmit}
                  name={this.state.popUp}
                  id="mainInput"
                >
                  <Row className="align-self-center">
                    <Row className="m-3">
                      <label htmlFor="email">
                        <small>Email</small>
                      </label>
                      <input name="email" type="text" />
                    </Row>
                    <Row>
                      <label htmlFor="password">
                        <small>Password</small>
                      </label>
                      <input name="password" type="password" />
                    </Row>
                  </Row>
                  <div>
                    <Button variant="primary" type="submit">
                      {this.state.popUp}
                    </Button>
                  </div>
                </form>
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    this.googleSignIn()
                    this.handleClose()
                  }}
                >
                  {this.state.popUp} with{' '}
                  <img src="https://img.icons8.com/color/24/000000/google-logo.png" />
                </Button>
                <Button variant="secondary" onClick={this.handleClose}>
                  Close
                </Button>
              </div>
            </Modal.Body>
          </Modal>
        ) : null}
      </div>
    )
  }
}
