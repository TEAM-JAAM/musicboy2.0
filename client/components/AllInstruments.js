import React from 'react'
import {connect} from 'react-redux'
// import {
//   stopMusic,
//   startMusic,
//   initGrid,
//   toggleCell,
//   createNewSequence,
//   updateSequences,
//   addRowToGrid,
//   removeRowFromGrid
// } from '../../utils'
import SingleInstrument from './SingleInstrument'
import Tone from 'tone'
import {Project} from '../firestore/models'

class AllInstruments extends React.Component {
  constructor() {
    super()
    this.sequences = []
    this.state = {
      // tempo: 80,
      playing: false,
      grid: initGrid(12, 8),
      update: true,
      instrument: null
    }
    this.handleToggleCell = this.handleToggleCell.bind(this)
    this.startOrStop = this.startOrStop.bind(this)
    this.addRow = this.addRow.bind(this)
    this.removeRow = this.removeRow.bind(this)
  }

  async componentDidMount() {
    let grid = this.state.grid
    for (let i = 0; i < grid.length; ++i) {
      this.sequences.push(createNewSequence(grid[i]))
    }

    // project document reference will be passed as a prop...
    // need to register for this project document
    // [projectDocRef, projectLoading, projectError] = useDocument(this.props.projectDocRef)
    const project = await Project.findByPk('npcyFF33WB3T5vc8Le2b')
    const projectDocRef = project && project.ref()

    // register for instrument collection reference...
    // [instrumentCollectionRef, instrumentsLoading, instrumentsError]
    const instrumentCollectionRef = Project.findAllInstruments(projectDocRef)
    const instrumentsQuerySnapshot = await instrumentCollectionRef.get()
    if (instrumentsQuerySnapshot.empty) {
      console.error('FATAL: failed to update ')
    }
    const instrument = instrumentsQuerySnapshot.docs[0].ref
    this.setState({
      instrument: instrument
    })
  }

  startOrStop() {
    if (!this.state.playing) {
      const curser = Tone.Transport.position
      this.setState({playing: true})
      Tone.Transport.start()
    } else {
      this.setState({playing: false})
      Tone.Transport.stop()
    }
  }

  addRow() {
    const grid = this.state.grid
    this.setState({
      grid: addRowToGrid(grid)
    })
    // all sequences must be updated
    this.sequences = this.sequences.map((sequence, idx) => {
      sequence.cancel()
      return createNewSequence(grid[idx])
    })
  }

  removeRow() {
    const grid = this.state.grid
    this.setState({
      grid: removeRowFromGrid(grid)
    })
    this.sequences = this.sequences.map((sequence, idx) => {
      sequence.cancel()
      return createNewSequence(grid[idx])
    })
  }

  handleToggleCell(cell) {
    toggleCell(cell)
    const rowIdx = cell.row
    const row = this.state.grid[rowIdx]
    this.sequences = updateSequences(this.sequences, row, rowIdx)
    this.setState({update: true})
  }

  render() {
    return (
      <div>
        <button className="play-btn" type="button" onClick={this.startOrStop}>
          {!this.state.playing ? '▶️' : '| |'}
        </button>
        <button
          className="increment-row-btn"
          type="button"
          onClick={this.addRow}
        >
          add column
        </button>
        <button
          disabled={this.state.grid[0].length <= 1}
          className="decrement-row-btn"
          type="button"
          onClick={this.removeRow}
        >
          remove column
        </button>
        <SingleInstrument
          handleToggleCell={this.handleToggleCell}
          grid={this.state.grid}
          instrumentDocRef={this.state.instrument}
        />
      </div>
    )
  }
}

export default connect()(AllInstruments)
