const {app} = require('../db')
const {Project} = require('../models')

const seed = async () => {
  try {
    // create default project...
    const project = await Project.findOrCreate({
      name: '@jaam.test.project'
    })
    console.log('NOTE: added test project successfully')

    // add an instrument to the project; also adds an iniital set of
    // timeslices...
    await project.addInstrument({
      name: 'piano'
    })
    console.log('NOTE: added test instrument successfully')
  } catch (error) {
    console.error(error)
  } finally {
    app.delete()
  }
}

seed()
