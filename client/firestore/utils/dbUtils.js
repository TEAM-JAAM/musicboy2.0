//
// --[ Exceptions ]---------------------------------------------------------
//
class MissingMandatoryFieldError extends Error {
  constructor(mandatoryFields = [], message = 'Missing mandatory field') {
    super(message)
    this.mandatoryFields = mandatoryFields
  }
}

class UnknownUserError extends Error {}
class UserDocumentUnavailable extends Error {}
class UnknownProjectError extends Error {}

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
  UnknownUserError,
  UserDocumentUnavailable,
  UnknownProjectError,

  allMandatoryFieldsProvided,
  populateDefaults
}
