import React from 'react'
import {AllProjects} from './AllProjects'
import {auth} from '../firestore/db'

/**
 * COMPONENT
 */
export const UserHome = () => {
  const email = auth.currentUser.email

  return (
    <div>
      <h3>Welcome, {email}</h3>
      <AllProjects email={email} />
    </div>
  )
}
