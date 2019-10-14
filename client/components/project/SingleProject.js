import React from 'react'

import {SingleProjectDetails} from './SingleProjectDetails'
import {SingleProjectInstruments} from './SingleProjectInstruments'

export const SingleProject = props => {
  const projectDocRef = props.match.params.docRef
  return (
    <div className="single-project">
      <SingleProjectDetails {...props} docRef={projectDocRef} />
      <SingleProjectInstruments docRef={projectDocRef} />
    </div>
  )
}
