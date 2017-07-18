const fs = require('fs-extra')
const path = require('path')

module.exports = (version, template) => {
  const templateFolder = path.join(__dirname, '../templates', version, template)

  // Use synchronous form to avoid callback
  try {
    fs.accessSync(templateFolder)
    return templateFolder
  } catch (error) {
    throw new Error(error)
  }
}
