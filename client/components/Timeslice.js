import React from 'react'
import Tone from 'tone'
import {AudioNode, toggleCell} from '../../utils'
import {G_MAJOR, G_MINOR} from '../../instruments'
import {useDocument} from 'react-firebase-hooks/firestore'

const Timeslice = props => {
  const slice = props.slice
  console.log('slice...', slice)
  const [sliceDocSnapshot, loading, error] = useDocument(slice && slice.ref)

  // const nodes = sliceDocSnapshot && sliceDocSnapshot.data().collection(`${props.sliceIndex}`);
  // console.log('nodes...', nodes);
  // const [ timeslicesQuerySnapshot, slicesLoading, slicesError ] = useDocument(nodes);

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
  console.log(
    'mapping over...',
    sliceDocSnapshot && Object.values(sliceDocSnapshot.data())
  )
  return (
    <div className="time-slice">
      {sliceDocSnapshot &&
        Object.values(sliceDocSnapshot.data()).map((status, idx) => {
          const cellClassName = status ? 'cell on' : 'cell off'
          let rowNum = idx
          const node = new AudioNode(props.sliceIndex, rowNum, G_MINOR[rowNum])
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
