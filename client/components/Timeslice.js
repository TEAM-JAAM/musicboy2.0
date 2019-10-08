import React from 'react'
import Tone from 'tone'
import {AudioNode, toggleCell} from '../../utils'
import {assignPitch_G_MAJOR, assignPitch_G_MINOR} from '../../instruments'
import {useDocument} from 'react-firebase-hooks/firestore'

const Timeslice = props => {
  const instrument = props.instrument
  const [instrumentDocSnapshot, loading, error] = useDocument(
    instrument && instrument.ref()
  )

  const timeslices = instrument && instrument.ref().collection('timeslices')
  const [timeslicesQuerySnapshot, slicesLoading, slicesError] = useDocument(
    timeslices
  )

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
      {props.slice.map((status, idx) => {
        const cellClassName = status ? 'cell on' : 'cell off'
        let rowNum = idx
        const node = new AudioNode(
          props.sliceIndex,
          rowNum,
          assignPitch_G_MINOR[rowNum]
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
