//
// --[ Exceptions ]---------------------------------------------------------
//
class MissingMandatoryFieldError extends Error {
  constructor(mandatoryFields = [], message = 'Missing mandatory field') {
    super(message)
    this.mandatoryFields = mandatoryFields
  }
}

//
// --[ Utility Methods ]----------------------------------------------------
const allMandatoryFieldsProvided = (objectData, mandatoryFields) => {
  const objectKeys = Object.keys(objectData)
  return mandatoryFields.every(field => objectKeys.includes(field))
}

const populateDefaults = (objectData, defaults) => {
  const defaultKeys = Object.keys(defaults)
  defaultKeys.forEach(key => {
    if (!objectData[key]) objectData[key] = defaults[key]
  })
}

module.exports = {
  MissingMandatoryFieldError,
  allMandatoryFieldsProvided,
  populateDefaults
}
