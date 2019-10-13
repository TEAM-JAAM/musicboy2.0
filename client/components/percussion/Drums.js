import React from 'react'

import DrumsDetails from './DrumsDetails'
import AllDrumslices from './AllDrumslices'

export const Drums = ({docRef}) => {
  return (
    <React.Fragment>
      <div className="drums-with-details">
        <DrumsDetails docRef={docRef} />
        <AllDrumslices docRef={docRef} />
      </div>
    </React.Fragment>
  )
}
