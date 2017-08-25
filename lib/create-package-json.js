const fs = require('fs-extra')
const path = require('path')

const gitConfig = require('./git-config')()

module.exports = (dir, data) => {
  const templateSource = require('./template-source')(data.styleguide.version, data.styleguide.template)

  // Base package.json information
  const packageJSON = {
    name: data.project.name,
    description: data.project.description,
    version: data.project.version,
    author: {
      name: data.author.name,
      email: data.author.email
    },
    license: data.license
  }

  // Add optional private flag
  if (data.private) {
    packageJSON.private = true
  }

  // Use Git URL and issues from remote config
  if (gitConfig.remote) {
    packageJSON.repository = {
      type: 'git',
      url: gitConfig.remote
    }

    packageJSON.bugs = {
      url: `${gitConfig.remote}/issues`,
      email: data.author.email
    }
  }

  // Import the template package.json
  const templatePackageJSON = require(path.join(templateSource, 'package.json'))
  const outputPackageJSON = Object.assign(packageJSON, templatePackageJSON)

  // Write the package.json file
  fs.writeFile(`${dir}/package.json`, JSON.stringify(outputPackageJSON, null, 2), 'utf8', error => {
    if (error) {
      throw new Error(error)
    }
  })
}
