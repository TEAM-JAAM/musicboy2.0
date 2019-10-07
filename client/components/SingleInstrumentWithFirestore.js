import React, {useState} from 'react'
import {useDocument} from 'react-firebase-hooks/firestore'
import {initGrid} from '../../utils'
import Timeslice from './Timeslice'

export default function SingleInstrument(props) {
  console.log('props: ', props)
  const [synthSequence, setSynthSequence] = useState([])
  const [instrument, loading, error] = useDocument(
    props.instrument && props.instrument.ref()
  )
  console.log(props.instrument)
  return (
    <div>
      <h1>Hello World</h1>
      <p>Current user: {instrument && instrument.data().currentUser}</p>
      <p>Key: {instrument && instrument.data().key}</p>
      <p>Name: {instrument && instrument.data().name}</p>
    </div>
  )
}
