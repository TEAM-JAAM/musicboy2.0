import React from 'react'

import {SingleProjectDetails} from './SingleProjectDetails'
import {SingleProjectInstruments} from './SingleProjectInstruments'

export const SingleProject = props => {
  const projectDocRef = props.match.params.docRef

  return (
    <React.Fragment>
      <SingleProjectDetails docRef={projectDocRef} />
      <SingleProjectInstruments docRef={projectDocRef} />
    </React.Fragment>
  )
}
