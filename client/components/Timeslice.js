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
          let rowIndex = idx
          let sliceIndex = props.sliceIndex
          let allNodes = props.allNodes
          const node = new AudioNode(
            props.sliceIndex,
            rowIndex,
            currentScale[rowIndex],
            currentInstrument
          )
          const cellClassName = status ? 'cell on' : 'cell off'

          if (!allNodes[sliceIndex]) {
            allNodes[sliceIndex] = {[rowIndex]: node}
          } else {
            allNodes[sliceIndex][rowIndex] = node
          }
          return (
            <div
              key={node.row}
              className={cellClassName}
              onClick={() => {
                props.handleToggleCell(node)
                // sliceDocSnapshot.update(node.row, node.status)
              }}
            />
          )
        })}
    </div>
  )
}

export default Timeslice
