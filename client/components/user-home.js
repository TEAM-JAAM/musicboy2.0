import React, {Component} from 'react'
import {db, auth} from '../firestore/db'

export default class UserHome extends Component {
  constructor() {
    super()
    this.state = {list: []}
  }
  async componentDidMount() {
    const docRef = await db
      .collection('users')
      .doc(auth.currentUser.uid)
      .get()

    const projects = docRef.data().projects
    console.log('CODYS project', projects)
    let projectsBody

    if (projects.id) {
      const projectsPromise = await db
        .collection('projects')
        .doc(projects.id)
        .get()
      if (projectsPromise) {
        projectsBody = projectsPromise.data()
      } else {
        projectsBody = null
      }
    } else {
      projectsBody = null
    }

    this.setState({list: [projectsBody]})
  }

  render() {
    console.log(this.state)
    const email = auth.currentUser.email
    return (
      <div>
        <h3>Welcome, {email}</h3>

        {this.state.list[0] ? (
          <div>{this.state.list.map(proj => <li key="1">{proj.name}</li>)}</div>
        ) : (
          <div />
        )}
      </div>
    )
  }
}
