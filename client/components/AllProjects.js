import React from 'react'
import {ProjectCard} from './ProjectCard'
import {Link} from 'react-router-dom'
// need projects from database

export const AllProjects = props => {
  const {email} = props
  const projects = [
    {
      id: 0,
      user: email.slice(0, email.indexOf('@')),
      name: 'My Project',
      image: '🎸'
    },
    {
      id: 1,
      user: email.slice(0, email.indexOf('@')),
      name: 'Weeee',
      image: '🎷'
    },
    {
      id: 2,
      user: email.slice(0, email.indexOf('@')),
      name: 'BB',
      image: '🎹'
    },
    {
      id: 3,
      user: 'Theo',
      name: '1234',
      image: '🎺'
    },
    {
      id: 4,
      user: 'Andre',
      name: 'Jam',
      image: '🎻'
    },
    {
      id: 5,
      user: 'Jake',
      name: 'JavaScript',
      image: '🎤'
    }
  ]
  return (
    <div>
      <div className="list-container">
        mines
        <Link to="/new">
          <div className="project-container">
            <div className="project-image">➕</div>
            <div className="project-header">New Project</div>
          </div>
        </Link>
        {projects.map(project => {
          return project.user === email.slice(0, email.indexOf('@')) ? (
            <ProjectCard key={project.id} project={project} />
          ) : null
        })}
      </div>

      <div className="list-container">
        other peoples
        {projects.map(project => {
          return project.user !== email.slice(0, email.indexOf('@')) ? (
            <ProjectCard key={project.id} project={project} />
          ) : null
        })}
      </div>
    </div>
  )
}
