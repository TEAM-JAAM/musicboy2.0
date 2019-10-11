const {app} = require('../db')
const {Project} = require('../models')

const createProjectOnce = async (projectName, type = 'Private') => {
  const project = await Project.findOrCreate({
    name: projectName,
    emoji: '🎵',
    max: 5,
    permissions: type
  })
  console.log('NOTE: added test project successfully')

  // add an instrument to the project; also adds an iniital set of
  // timeslices...
  await project.addInstrument({
    name: 'marimba'
  })
  console.log('NOTE: added test instrument successfully')

  return project
}

const seed = async () => {
  try {
    // project with 1 instrument added to test123@email.com
    const projectWith1Instrument = await createProjectOnce(
      '@jaam.test.single-instrument'
    )
    await projectWith1Instrument.addUserToProject({
      email: 'test123@email.com',
      uid: '5pHrmJQMCpXQvKZ3nVmvdlJ1RXA2'
    })
    await projectWith1Instrument.addUserToProject({
      email: 'test1234@email.com',
      uid: 'NsutCoTAD7TndhjoPoaKeKyq7MZ2'
    })

    // project with 3 instruments added to cody@email.com
    const projectWith3Instruments = await createProjectOnce(
      '@jaam.test.3-instruments'
    )
    await projectWith3Instruments.addInstrument({
      name: 'saxaphone'
    })
    await projectWith3Instruments.addInstrument({
      name: 'accordian'
    })
    await projectWith3Instruments.addUserToProject({
      email: 'cody@email.com',
      uid: '6ox30d9FbvSfAInSSwQyAnk59bJ3'
    })
    await projectWith3Instruments.addUserToProject({
      email: 'test1234@email.com',
      uid: 'NsutCoTAD7TndhjoPoaKeKyq7MZ2'
    })

    // public project with 1 instrument...
    const publicProjectWith1Instrument = await createProjectOnce(
      '@jaam.test.public.1-instrument',
      'Public'
    )

    // public project with 3 instruments...
    const publicProjectWith3Instruments = await createProjectOnce(
      '@jaam.test.public.3-instruments',
      'Public'
    )
    await publicProjectWith3Instruments.addInstrument({
      name: 'saxaphone'
    })
    await publicProjectWith3Instruments.addInstrument({
      name: 'accordian'
    })

    // all projects added to test1234@email.com...
    await publicProjectWith1Instrument.addUserToProject({
      email: 'test1234@email.com',
      uid: 'NsutCoTAD7TndhjoPoaKeKyq7MZ2'
    })
    await publicProjectWith3Instruments.addUserToProject({
      email: 'test1234@email.com',
      uid: 'NsutCoTAD7TndhjoPoaKeKyq7MZ2'
    })

    console.log('NOTE: completed database seed')
  } catch (error) {
    console.error(error)
  } finally {
    app.delete()
  }
}

seed()
