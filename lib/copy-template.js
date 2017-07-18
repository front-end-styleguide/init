const fs = require('fs-extra')
const path = require('path')

module.exports = (dir, data) => {
  const templateSource = require('./template-source')(data.styleguide.version, data.styleguide.template)

  // Exclude these files from copying
  const filter = src => {
    const filename = path.parse(src).base
    const excludeList = ['gitignore', 'package.json']

    if (excludeList.indexOf(filename) !== -1) {
      return false
    }

    return true
  }

  // Copy the template contents except the files specified above
  fs.copy(templateSource, dir, { filter }, error => {
    if (error) {
      throw new Error(error)
    }
  })

  // Copy gitignore and rename to .gitignore
  fs.copy(path.join(templateSource, 'gitignore'), path.join(dir, '.gitignore'), error => {
    if (error) {
      throw new Error(error)
    }
  })
}
