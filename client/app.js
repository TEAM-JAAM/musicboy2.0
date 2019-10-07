import React, {Component} from 'react'
import {db} from './firestore/db'
import {Navbar} from './components'
import Routes from './routes'

class App extends Component {
  handleClick = async () => {
    const firstJaamRef = db.collection('projects').doc('big-bang')
    console.log('firstJaamRef.get: ', firstJaamRef.get())

    try {
      const doc = await firstJaamRef.get()
      console.log('Document data:', doc.data())

      const newCount = doc.data().count + 1
      await firstJaamRef.update({
        count: newCount
      })
      console.log('NOTE: updated document successfully')
    } catch (error) {
      console.log('Error getting document:', error)
    }
  }

  render() {
    return (
      <div>
        <Navbar />
        <Routes />
      </div>
    )
  }
}

export default App
