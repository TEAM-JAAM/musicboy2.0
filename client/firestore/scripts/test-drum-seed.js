const {app} = require('../db')
const {Project} = require('../models')

async function createProjectWithDrums(projectName, type = 'Public') {
  const project = await Project.findOrCreate({
    name: projectName,
    emoji: '🍌',
    max: 5,
    permissions: type
  })
  console.log('NOTE: added test project with drums successfully')

  // add drums to the project
  //  also adds an iniital set of drumslices
  await project.addDrums()
  console.log('NOTE: added test drums successfully')

  await project.addInstrument({name: 'synth'})
  await project.addUserToProject({
    email: 'test123@email.com',
    uid: '5pHrmJQMCpXQvKZ3nVmvdlJ1RXA2'
  })
  return project
}

async function seedProjectWithDrums() {
  try {
    await createProjectWithDrums('banana drums')
    console.log('successfully seeded project with drums!')
  } catch (err) {
    console.log('ERROR seeding project with drums:', err)
  } finally {
    app.delete()
  }
}

seedProjectWithDrums()
