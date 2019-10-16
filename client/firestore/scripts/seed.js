/* eslint-disable max-statements */
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
    name: 'electricCello'
  })
  console.log('NOTE: added test instrument successfully')

  return project
}

const seed = async () => {
  try {
    // project with 1 instrument added to test123@email.com
    const projectWith1Instrument = await createProjectOnce('Dance Party')
    await projectWith1Instrument.addUserToProject({
      email: 'andreasoloko@gmail.com',
      uid: 'G7UijBPqV4aWBNHFM3jChIj1Oyk1'
    })
    await projectWith1Instrument.addUserToProject({
      email: 'test123@email.com',
      uid: '5pHrmJQMCpXQvKZ3nVmvdlJ1RXA2'
    })
    await projectWith1Instrument.addUserToProject({
      email: 'test1234@email.com',
      uid: 'NsutCoTAD7TndhjoPoaKeKyq7MZ2'
    })

    // project with 1 instrument 2 added to test123@email.com & andrea
    const projectWith1Instrument2 = await createProjectOnce('Jazz Vibes')
    await projectWith1Instrument2.addUserToProject({
      email: 'test123@email.com',
      uid: '5pHrmJQMCpXQvKZ3nVmvdlJ1RXA2'
    })
    await projectWith1Instrument2.addUserToProject({
      email: 'andreasoloko@gmail.com',
      uid: 'G7UijBPqV4aWBNHFM3jChIj1Oyk1'
    })

    // project with 1 instrument 3 added to test123@email.com & andrea
    const projectWith1Instrument3 = await createProjectOnce(
      'Welcome to Rock City',
      'Public'
    )
    await projectWith1Instrument3.addUserToProject({
      email: 'test123@email.com',
      uid: '5pHrmJQMCpXQvKZ3nVmvdlJ1RXA2'
    })
    await projectWith1Instrument3.addUserToProject({
      email: 'andreasoloko@gmail.com',
      uid: 'G7UijBPqV4aWBNHFM3jChIj1Oyk1'
    })

    // project with 3 instruments added to cody@email.com
    const projectWith3Instruments = await createProjectOnce(
      'Testing, Testing, 1-2-3'
    )
    await projectWith3Instruments.addInstrument({
      name: 'electricCello'
    })
    await projectWith3Instruments.addInstrument({
      name: 'marimba'
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
      'Money in the Banana',
      'Public'
    )
    const publicProjectWith1Instrument2 = await createProjectOnce(
      'Theo is Making a Game',
      'Public'
    )
    const publicProjectWith1Instrument3 = await createProjectOnce(
      'Chris Can Juggle',
      'Public'
    )

    // public project with 3 instruments...
    const publicProjectWith3Instruments = await createProjectOnce(
      'You Spin Me Right Triangle',
      'Public'
    )
    await publicProjectWith3Instruments.addInstrument({
      name: 'synth'
    })
    await publicProjectWith3Instruments.addInstrument({
      name: 'steelPan'
    })

    // all projects added to test1234@email.com...
    await publicProjectWith1Instrument.addUserToProject({
      email: 'test1234@email.com',
      uid: 'NsutCoTAD7TndhjoPoaKeKyq7MZ2'
    })
    await publicProjectWith1Instrument2.addUserToProject({
      email: 'test1234@email.com',
      uid: 'NsutCoTAD7TndhjoPoaKeKyq7MZ2'
    })
    await publicProjectWith1Instrument3.addUserToProject({
      email: 'test1234@email.com',
      uid: 'NsutCoTAD7TndhjoPoaKeKyq7MZ2'
    })
    await publicProjectWith3Instruments.addUserToProject({
      email: 'test1234@email.com',
      uid: 'NsutCoTAD7TndhjoPoaKeKyq7MZ2'
    })
    // all projects added to andreasoloko@gmail.com...
    await publicProjectWith1Instrument.addUserToProject({
      email: 'andreasoloko@gmail.com',
      uid: 'G7UijBPqV4aWBNHFM3jChIj1Oyk1'
    })
    await publicProjectWith1Instrument2.addUserToProject({
      email: 'andreasoloko@gmail.com',
      uid: 'G7UijBPqV4aWBNHFM3jChIj1Oyk1'
    })
    await publicProjectWith1Instrument3.addUserToProject({
      email: 'andreasoloko@gmail.com',
      uid: 'G7UijBPqV4aWBNHFM3jChIj1Oyk1'
    })
    await publicProjectWith3Instruments.addUserToProject({
      email: 'andreasoloko@gmail.com',
      uid: 'G7UijBPqV4aWBNHFM3jChIj1Oyk1'
    })

    console.log('NOTE: completed database seed')
  } catch (error) {
    console.error(error)
  } finally {
    app.delete()
  }
}

seed()
