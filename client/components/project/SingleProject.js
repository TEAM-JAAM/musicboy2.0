import React from 'react'

import {SingleProjectDetails} from './SingleProjectDetails'
import {SingleProjectInstruments} from './SingleProjectInstruments'
import {SingleProjectPercussion} from './SingleProjectPercussion'

export const SingleProject = props => {
  const projectDocRef = props.match.params.docRef
  return (
    <React.Fragment>
      <SingleProjectDetails docRef={projectDocRef} />
      <SingleProjectInstruments docRef={projectDocRef} />
      <SingleProjectPercussion docRef={projectDocRef} />
    </React.Fragment>
  )
}
