const chalk = require('chalk')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const path = require('path')

const gitConfigLocal = require('./git-config').local
const gitConfigGlobal = require('./git-config').global

exports.overwrite = dir => {
  return [
    {
      type: 'confirm',
      name: 'overwrite',
      message: 'Directory not empty! Continue and clean directory (‘.git’ and ‘node_modules’ are kept)',
      default: false,
      when () {
        return fs.readdirSync(dir).length > 0
      }
    }
  ]
}

exports.list = dir => {
  return [
    {
      type: 'list',
      name: 'styleguide.version',
      message: 'Select the styleguide version',
      choices: fs.readdirSync(path.join(__dirname, '../templates')),
      default: 'v3'
    },
    {
      type: 'list',
      name: 'styleguide.template',
      message: 'Select the styleguide template',
      choices (answers) {
        return fs.readdirSync(path.join(__dirname, '../templates', answers.styleguide.version))
      },
      default: 'example'
    },
    {
      type: 'input',
      name: 'project.name',
      message: 'Project name',
      default: path.parse(dir).name.toLowerCase().replace(/[^a-z\d-_]/, '-'),
      validate (value) {
        if (value.match(/^[^_.][a-z\d-_.]{1,213}$/)) {
          return true
        }

        return `Please follow these rules:
 - Max 214 characters
 - Can’t start with dot or underscore
 - Can contain dashes, dots and underscores elsewhere`
      },
      filter (value) {
        return value.toLowerCase()
      }
    },
    {
      type: 'input',
      name: 'project.description',
      message: 'Project description',
      default (answers) {
        return `Living styleguide for ${answers.project.name}`
      },
      validate (value) {
        if (value) {
          return true
        }

        return 'Please enter a short description.'
      }
    },
    {
      type: 'input',
      name: 'project.version',
      message: 'Project version',
      default: '1.0.0',
      validate (value) {
        if (value.match(/^\d+\.\d+\.\d+$/)) {
          return true
        }

        return chalk`Please follow Semantic Versioning ({blue http://semver.org}).`
      }
    },
    {
      type: 'input',
      name: 'author.name',
      message: 'Author name',
      default () {
        if (gitConfigLocal.user && gitConfigLocal.user.name) {
          return gitConfigLocal.user.name
        }

        if (gitConfigGlobal.user && gitConfigGlobal.user.name) {
          return gitConfigGlobal.user.name
        }

        return null
      },
      validate (value) {
        if (value) {
          return true
        }

        return 'Don’t you have a name?'
      }
    },
    {
      type: 'input',
      name: 'author.email',
      message: 'Author email',
      default () {
        if (gitConfigLocal.user && gitConfigLocal.user.email) {
          return gitConfigLocal.user.email
        }

        if (gitConfigGlobal.user && gitConfigGlobal.user.email) {
          return gitConfigGlobal.user.email
        }

        return null
      },
      validate (value) {
        if (value.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/i)) {
          return true
        }

        return 'Please enter a valid email address.'
      }
    },
    {
      type: 'confirm',
      name: 'private',
      message: 'Flag project as private'
    },
    {
      type: 'list',
      name: 'license',
      message: 'Select a license',
      choices: [
        'MIT',
        'Apache-2.0',
        'GPL-3.0',
        new inquirer.Separator(),
        'Custom'
      ],
      when (answers) {
        return !answers.private
      }
    },
    {
      type: 'input',
      name: 'license',
      message: 'Enter a custom license (https://spdx.org/licenses/)',
      when (answers) {
        return answers.license === 'Custom'
      }
    }
  ]
}