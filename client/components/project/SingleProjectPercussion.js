import React from 'react'
import {useCollection} from 'react-firebase-hooks/firestore'
import {Spinner, Container, Col, Row} from 'react-bootstrap'

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
      <Container fluid className="mt-3">
        {percussionDocRefs.map(drumsDocRef => {
          return (
            <Row key={drumsDocRef.id} className="mt-3">
              <Col>
                <Drums docRef={drumsDocRef.ref} />
              </Col>
            </Row>
          )
        })}
      </Container>
    )
  }
}
