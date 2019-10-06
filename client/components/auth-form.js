import React, {Component} from 'react'
import {connect} from 'react-redux'

import {db, auth} from '../firestore/db'

class AuthForm extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(evt) {
    evt.preventDefault()
    const formName = evt.target.name
    const email = evt.target.email.value
    const password = evt.target.password.value
    const projects = evt.target.projects.value

    if (formName === 'signup') {
      auth.createUserWithEmailAndPassword(email, password).then(cred => {
        return db
          .collection('users')
          .doc(cred.user.uid)
          .set({
            projects: projects
          })
      })
    } else if (formName === 'login') {
      auth.signInWithEmailAndPassword(email, password)
    }
  }

  render() {
    const {name, displayName, error} = this.props
    return (
      <div>
        <form onSubmit={this.handleSubmit} name={name}>
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
        <a href="/auth/google">{displayName} with Google</a>
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
