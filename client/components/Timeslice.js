import React from 'react'
import Tone from 'tone'
import {AudioNode} from '../../utils'
import {assignPitch} from '../../instruments'

const Timeslice = props => {
  return (
    <div className="time-slice">
      {props.slice.map((status, idx) => {
        const cellClassName = status ? 'cell on' : 'cell off'
        console.log('status', status)
        console.log('props', props)
        let rowNum = idx
        const node = new AudioNode(
          props.sliceIndex,
          rowNum,
          assignPitch[props.sliceIndex]
        )
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
