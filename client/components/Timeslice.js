import React from 'react'
import Tone from 'tone'
import {AudioNode} from '../../utils'
import {useDocument} from 'react-firebase-hooks/firestore'
import {
  synth,
  tiny,
  kalimba,
  electricCello,
  steelPan,
  marimba,
  bassGuitar,
  pianoetta,
  G_MAJOR,
  G_MINOR,
  PENTATONIC
} from '../../instruments'

const Timeslice = props => {
  const slice = props.slice
  const [sliceDocSnapshot, loading, error] = useDocument(slice && slice.ref)

  const currentInstrument = synth
  const currentScale = PENTATONIC

  return (
    <div className="time-slice">
      {sliceDocSnapshot &&
        Object.values(sliceDocSnapshot.data()).map((status, idx) => {
          const cellClassName = status ? 'cell on' : 'cell off'
          let rowIndex = idx
          let sliceIndex = props.sliceIndex
          const node = new AudioNode(
            props.sliceIndex,
            rowIndex,
            currentScale[rowIndex],
            currentInstrument
          )
          if (!props.allNodes[rowIndex]) {
            props.allNodes[rowIndex] = {[sliceIndex]: node}
          } else {
            props.allNodes[rowIndex][sliceIndex] = node
          }
          return (
            <div
              key={node.row}
              className={cellClassName}
              onClick={() => props.handleToggleCell(node)}
            />
          )
        })}
    </div>
  )
}

export default Timeslice
