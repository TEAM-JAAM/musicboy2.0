/* eslint-disable no-alert */
import React, {Component} from 'react'
import {connect} from 'react-redux'

import {db, auth, provider} from '../firestore/db'

class AuthForm extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.googleSignIn = this.googleSignIn.bind(this)
  }

  handleSubmit(evt) {
    evt.preventDefault()
    console.log(evt)
    const formName = evt.target.name
    const email = evt.target.email.value
    const password = evt.target.password.value
    const projects = evt.target.projects.value

    if (formName === 'signup') {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then(cred => {
          return db
            .collection('users')
            .doc(cred.user.uid)
            .set({
              projects: projects
            })
        })
        .catch(error => {
          alert(error)
          document.getElementById('mainInput').reset()
        })
    } else if (formName === 'login') {
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
        // ...
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
        // The email of the user's account used.
        var email = error.email
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential
        // ...
      })
  }

  render() {
    const {name, displayName, error} = this.props
    return (
      <div>
        <form onSubmit={this.handleSubmit} name={name} id="mainInput">
          <div>
            <label htmlFor="email">
              <small>Email</small>
            </label>
            <input name="email" type="text" />
          </div>
          <div>
            <label htmlFor="password">
              <small>Password</small>
            </label>
            <input name="password" type="password" />
          </div>
          <div>
            <label htmlFor="projects">
              <small>Projects</small>
            </label>
            <input name="projects" type="text" />
          </div>
          <div>
            <button type="submit">{displayName}</button>
          </div>
          {error && error.response && <div> {error.response.data} </div>}
        </form>
        <button type="button" onClick={this.googleSignIn}>
          {displayName} with Google
        </button>
        {/* <a href="/auth/google">{displayName} with Google</a> */}
      </div>
    )
  }
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  }
}

// const mapDispatch = dispatch => {
//   return {
//     handleSubmit(evt) {
//       evt.preventDefault()
//       const formName = evt.target.name
//       const email = evt.target.email.value
//       const password = evt.target.password.value
//       const projects = evt.target.projects.value

//       auth.createUserWithEmailAndPassword(email, password).then(cred => {
//         console.log('user creds', cred)
//         return db
//           .collection('users')
//           .doc(cred.user.uid)
//           .set({
//             projects: projects
//           })
//       })

//       //dispatch(auth(email, password, formName))
//     }
//   }
// }

export const Login = connect(mapLogin)(AuthForm)
export const Signup = connect(mapSignup)(AuthForm)
