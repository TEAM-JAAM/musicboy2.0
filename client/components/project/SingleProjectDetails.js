import React from 'react'
import Tone from 'tone'
import {useDocument} from 'react-firebase-hooks/firestore'
import {Button, Spinner} from 'react-bootstrap'

import {Project} from '../../firestore/models'

export const SingleProjectDetails = ({docRef}) => {
  const projectDocRef = Project.findProjectQuery(docRef)
  const [projectQueryResult, loading, error] = useDocument(projectDocRef)
  const project = Project.fetchProjectData(projectQueryResult)

  if (error) throw new Error('FATAL: firestore error encountered')
  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="align-self-center sr-only">Loading...</span>
      </Spinner>
    )
  }
  if (projectQueryResult) {
    return (
      <div>
        <h1>Single Project Details</h1>
        <p>project.name: {project.name}</p>
        <p>project.members: {project.members.join(', ')}</p>
        <p>project.emoji: {project.emoji}</p>
        <p>project.maxMembers: {project.max}</p>
        <p>project.permissions: {project.permissions}</p>
        <p>project.tempo: {project.tempo}</p>
        <br />
        <Button
          variant="success"
          onClick={() => {
            Tone.Transport.start()
          }}
        >
          Play
        </Button>
        <Button
          variant="warning"
          onClick={() => {
            Tone.Transport.stop()
          }}
        >
          Stop
        </Button>
      </div>
    )
  }
}
