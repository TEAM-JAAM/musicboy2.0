import React from 'react'

export const SingleProject = props => {
  const project = props.project
  return (
    <div className="project-container">
      <div className="project-image">{project.image}</div>
      <div className="project-header">{project.name}</div>
      <div className="project-info">managed by {project.user}</div>
    </div>
  )
}
