import React from 'react'
import AllProjects from './AllProjects'
import {auth} from '../firestore/db'
import NewProjectForm from './NewProjectForm'
import {withRouter} from 'react-router-dom'
import CarouselProjects from './CarouselProjects'

const UserHome = () => {
  const email = auth.currentUser.email
  const uid = auth.currentUser.uid
  return (
    <div>
      <CarouselProjects />
      <NewProjectForm email={email} uid={uid} />
    </div>
  )
}

export default withRouter(UserHome)
