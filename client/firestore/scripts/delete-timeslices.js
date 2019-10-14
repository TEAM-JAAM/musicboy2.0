const {app, db} = require('../db')
const {Project} = require('../models')

const test = async () => {
  try {
    const projectDocName = process.argv[2]
    const projectCollectionRef = db.collection('projects')
    const projects = await projectCollectionRef
      .where('name', '==', projectDocName)
      .get()

    if (projects.empty) {
      console.log('ERROR: project [', projectDocName, '] not found')
    } else {
      const project = Project.fromDocRef(projects.docs[0].ref)
      await project.removeTimesliceBlock()
      console.log(
        'NOTE: successfully removed timeslices from: ',
        projectDocName
      )
    }
  } catch (error) {
    console.error(error)
  } finally {
    app.delete()
  }
}

test()
