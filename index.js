'use strict'

/* DEPENDENCIES
 * ========================================================================== */

const chalk = require('chalk')
const fs = require('fs-extra')
const gitConfigPath = require('git-config-path')
const inquirer = require('inquirer')
const parseGitConfig = require('parse-git-config')
const path = require('path')
const rimraf = require('rimraf')
const spawn = require('child_process').spawn

/* GIT CONFIG
 * ========================================================================== */

const gitConfigLocal = parseGitConfig.sync({
  cwd: '/',
  path: gitConfigPath({ cwd: __dirname })
})

const gitConfigGlobal = parseGitConfig.sync({
  cwd: '/',
  path: gitConfigPath('global')
})

/* INSTALL DEPENDENCIES
 * ========================================================================== */

const installDependencies = (dir, version) => {
  switch (version) {
    case 'v2':
      spawn('npm', [
        'install', '--save',
        'normalize.css',
        'svgxuse'
      ], { cwd: dir, shell: true, stdio: 'inherit' })
      break
    default:
      spawn('npm', [
        'install', '--save',
        'normalize.css',
        'svgxuse'
      ], { cwd: dir, shell: true, stdio: 'inherit' })
  }
}

const installDevDependencies = (dir, version) => {
  switch (version) {
    case 'v2':
      spawn('npm', [
        'install', '--save-dev',
        'babel-preset-es2015',
        'front-end-styleguide@2'
      ], { cwd: dir, shell: true, stdio: 'inherit' })
      break
    default:
      spawn('npm', [
        'install', '--save-dev',
        'babel-preset-es2015',
        'eslint-config-standard',
        'eslint-plugin-import',
        'eslint-plugin-node',
        'eslint-plugin-promise',
        'eslint-plugin-standard',
        'front-end-styleguide',
        'stylelint-config-standard'
      ], { cwd: dir, shell: true, stdio: 'inherit' })
  }
}

/* CREATE PACKAGE.JSON
 * ========================================================================== */

const createPackageJSON = (dir, data) => {
  // Base package.json information
  const packageJSON = {
    name: data.project.name,
    description: data.project.description,
    version: data.project.version,
    author: `${data.author.name} <${data.author.email}>`,
    scripts: {
      start: './node_modules/.bin/front-end-styleguide',
      development: './node_modules/.bin/front-end-styleguide development',
      preview: './node_modules/.bin/front-end-styleguide preview',
      production: './node_modules/.bin/front-end-styleguide production',
      update: './node_modules/.bin/front-end-styleguide update'
    },
    license: data.private ? 'UNLICENSED' : data.license
  }

  if (data.private) {
    packageJSON.private = true
  }

  // Expand package.json depending on the styleguide version
  switch (data.styleguide.version) {
    case 'v2':
      break
    default:
      packageJSON.scripts.test = './node_modules/.bin/front-end-styleguide test'
  }

  fs.writeFile(`${dir}/package.json`, JSON.stringify(packageJSON, null, 2), 'utf8', error => {
    if (error) {
      return console.error(error)
    }

    installDependencies(dir, data.styleguide.version)
    installDevDependencies(dir, data.styleguide.version)
  })
}

/* RENAME `gitignore` TO `.gitignore`
 * ========================================================================== */

const renameGitignore = dir => {
  fs.move(`${dir}/gitignore`, `${dir}/.gitignore`, error => {
    if (error) {
      return console.error(error)
    }
  })
}

/* COPY TEMPLATE
 * ========================================================================== */

const copyTemplate = (dir, data) => {
  fs.copy(`${__dirname}/templates/${data.styleguide.version}/${data.styleguide.template}`, dir, error => {
    if (error) {
      return console.error(error)
    }

    renameGitignore(dir)
  })
}

/* INITIALIZE NEW PROJECT
 * ========================================================================== */

module.exports = dir => {
  fs.ensureDirSync(dir)

  console.log(chalk`

{bold.blue ╔═════════════════════════════════════╗}

{bold.blue ║} {bold Front-End-Styleguide Initialization} {bold.blue ║}

{bold.blue ╚═════════════════════════════════════╝}

`)

  const projectInitilization = (dir, data) => {
    console.log(chalk`

{bold.green Thank you, that’s it!}

Just wait a minute for the finishing touches.

`)

    const rimrafOptions = {
      glob: {
        dot: true,
        ignore: [`${dir}/.git/**`, `${dir}/node_modules/**`]
      }
    }

    rimraf(`${dir}/**/*`, rimrafOptions, () => {
      createPackageJSON(dir, data)
      copyTemplate(dir, data)
    })
  }

  const questionOverwrite = [
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

  const questionList = [
    {
      type: 'list',
      name: 'styleguide.version',
      message: 'Select the styleguide version',
      choices: fs.readdirSync(`${__dirname}/templates`),
      default: 'v3'
    },
    {
      type: 'list',
      name: 'styleguide.template',
      message: 'Select the styleguide template',
      choices (answers) {
        return fs.readdirSync(`${__dirname}/templates/${answers.styleguide.version}`)
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

        return chalk`Please follow these rules:
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

  inquirer.prompt(questionOverwrite).then(answers => {
    if (answers.overwrite) {
      inquirer.prompt(questionList).then(answers => {
        projectInitilization(dir, answers)
      })
    } else {
      console.log(chalk`

{bold.red Initialization cancelled}

`)
    }
  })
}
