import React from 'react'
import {useCollection} from 'react-firebase-hooks/firestore'
import {Spinner} from 'react-bootstrap'

import {Project} from '../../firestore/models'
import {Drums} from '../percussion/Drums'

export const SingleProjectPercussion = ({docRef}) => {
  const percussionCollectionRef = Project.findProjectPercussionQuery(docRef)
  const [percussionQueryResult, loading, error] = useCollection(
    percussionCollectionRef
  )
  const percussionDocRefs = Project.fetchPercussionDocRefs(
    percussionQueryResult
  )

  if (error) throw new Error('FATAL: firestore error encountered')
  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="align-self-center sr-only">Loading...</span>
      </Spinner>
    )
  }
  if (percussionQueryResult) {
    return (
      <div>
        {percussionDocRefs.map(drumsDocRef => {
          return <Drums key={drumsDocRef.id} docRef={drumsDocRef.ref} />
        })}
      </div>
    )
  }
}
