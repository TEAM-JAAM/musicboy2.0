const {app} = require('../db')
const {Project, User} = require('../models')

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
    name: 'piano'
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
    const test123 = await User.findOne({
      uid: '5pHrmJQMCpXQvKZ3nVmvdlJ1RXA2'
    })
    await test123.addProjectToUser(projectWith1Instrument)

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
    const cody = await User.findOne({
      uid: '6ox30d9FbvSfAInSSwQyAnk59bJ3'
    })
    await cody.addProjectToUser(projectWith3Instruments)

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
    const test1234 = await User.findOne({
      uid: 'NsutCoTAD7TndhjoPoaKeKyq7MZ2'
    })
    await test1234.addProjectToUser(projectWith1Instrument)
    await test1234.addProjectToUser(projectWith3Instruments)
    await test1234.addProjectToUser(publicProjectWith1Instrument)
    await test1234.addProjectToUser(publicProjectWith3Instruments)

    console.log('NOTE: completed database seed')
  } catch (error) {
    console.error(error)
  } finally {
    app.delete()
  }
}

seed()
