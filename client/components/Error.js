import React from 'react'
import {Badge} from 'react-bootstrap'

const Err = () => {
  return (
    <div style={{textAlign: 'center', alignContent: 'center'}}>
      <h1 style={{textAlign: 'center'}}>
        <Badge variant="danger">404</Badge>
      </h1>
      <img
        src="https://media2.giphy.com/media/4PvP4zij51Lyw/source.gif"
        style={{maxWidth: '100vw', minHeight: '70vh', alignSelf: 'center'}}
      />
    </div>
  )
}

export default Err
