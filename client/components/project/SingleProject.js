import React from 'react'

import {SingleProjectDetails} from './SingleProjectDetails'
import {SingleProjectInstruments} from './SingleProjectInstruments'
import {SingleProjectPercussion} from './SingleProjectPercussion'

export const SingleProject = props => {
  const projectDocRef = props.match.params.docRef
  return (
    <div className="single-project">
      <SingleProjectDetails {...props} docRef={projectDocRef} />
      <SingleProjectInstruments docRef={projectDocRef} />
      <SingleProjectPercussion docRef={projectDocRef} />
    </div>
  )
}
