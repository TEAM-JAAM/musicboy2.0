import React from 'react'
import Tone from 'tone'
import {AudioNode, toggleCell} from '../../utils'
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

  const currentInstrument = steelPan
  const currentScale = PENTATONIC

  function handleToggleCell(cell) {
    toggleCell(cell)
    console.log(cell)
    // const rowIdx = cell.row;
    // const grid = Object.values(this.state.grid);
    // let timeSlice = grid.map((tSlice) => {
    // 	return tSlice[rowIdx];
    // });
    // this.sequences = updateSequences(this.sequences, timeSlice, rowIdx);
  }
  return (
    <div className="time-slice">
      {sliceDocSnapshot &&
        Object.values(sliceDocSnapshot.data()).map((status, idx) => {
          const cellClassName = status ? 'cell on' : 'cell off'
          let rowNum = idx
          const node = new AudioNode(
            props.sliceIndex,
            rowNum,
            currentScale[rowNum],
            currentInstrument
          )
          return (
            <div
              key={node.row}
              className={cellClassName}
              onClick={() => handleToggleCell(node)}
            />
          )
        })}
    </div>
  )
}

export default Timeslice
