import React, {useEffect, useRef} from 'react'
import {useCollection, useDocument} from 'react-firebase-hooks/firestore'
import {Spinner} from 'react-bootstrap'
import {SingleDrumslice} from '../drumslice/SingleDrumslice'
import {Drums} from '../../firestore/models'

const AllDrumslices = ({docRef}) => {
  const [drumsQueryResult, drumsLoading, drumsError] = useDocument(docRef)

  const drumslicesCollectionRef = Drums.findDrumslicesQuery(docRef)

  const [
    drumslicesQueryResult,
    drumslicesLoading,
    drumslicesError
  ] = useCollection(drumslicesCollectionRef)
  const drumslicesDocRefs = Drums.fetchDrumsliceDocRefs(drumslicesQueryResult)

  if (drumsError || drumslicesError)
    throw new Error('FATAL: firestore error encountered')
  if (drumsLoading || drumslicesLoading) {
    return (
      <Spinner animation="border" role="status">
        <span className="align-self-center sr-only">Loading...</span>
      </Spinner>
    )
  }

  if (drumsQueryResult) {
    return (
      <div className="single-drums-container">
        {drumslicesDocRefs.map(drumsliceDocRef => {
          return (
            <SingleDrumslice
              key={drumsliceDocRef.id}
              docRef={drumsliceDocRef.ref}
            />
          )
        })}
      </div>
    )
  }
}

export default AllDrumslices
