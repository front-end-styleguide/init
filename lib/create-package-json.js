const fs = require('fs-extra')
const gitUp = require('git-up')
const path = require('path')

const gitConfigLocal = require('./git-config').local

module.exports = (dir, data) => {
  const templateSource = require('./template-source')(data.styleguide.version, data.styleguide.template)

  // Base package.json information
  const packageJSON = {
    name: data.project.name,
    description: data.project.description,
    version: data.project.version,
    author: `${data.author.name} <${data.author.email}>`,
    license: data.private ? 'UNLICENSED' : data.license
  }

  // Add optional private flag
  if (data.private) {
    packageJSON.private = true
  }

  // Create Git URL and issues from remote
  if (gitConfigLocal['remote "origin"']) {
    let remote = gitUp(gitConfigLocal['remote "origin"'].url)
    let path = remote.pathname
      .substring(0, remote.pathname.lastIndexOf('.git'))
    let url = `https://${remote.resource}${path}`

    packageJSON.repository = {
      type: 'git',
      url
    }

    packageJSON.bugs = {
      url: `${url}/issues`,
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
