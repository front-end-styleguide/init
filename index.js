'use strict'

/* DEPENDENCIES
 * ========================================================================== */

const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')
const prompt = require('prompt')
const rimraf = require('rimraf')
const spawn = require('child_process').spawn

/* INSTALL DEPENDENCIES
 * ========================================================================== */

const installDependencies = (dir, styleguideVersion) => {
  switch (styleguideVersion) {
    case 2:
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

const installDevDependencies = (dir, styleguideVersion) => {
  switch (styleguideVersion) {
    case 2:
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
  const packageJSON = {
    name: data.projectName,
    description: data.projectDescription,
    version: data.projectVersion,
    author: `${data.authorName} <${data.authorEmail}>`,
    scripts: {
      start: './node_modules/.bin/front-end-styleguide',
      development: './node_modules/.bin/front-end-styleguide development',
      preview: './node_modules/.bin/front-end-styleguide preview',
      production: './node_modules/.bin/front-end-styleguide production',
      update: './node_modules/.bin/front-end-styleguide update'
    }
  }

  // Expand package.json depending on the styleguide version
  switch (data.styleguideVersion) {
    case 2:
      break
    default:
      packageJSON.scripts.test = './node_modules/.bin/front-end-styleguide test'
  }

  fs.writeFile(`${dir}/package.json`, JSON.stringify(packageJSON, null, 2), 'utf8', error => {
    if (error) {
      return console.error(error)
    }

    installDependencies(dir, data.styleguideVersion)
    installDevDependencies(dir, data.styleguideVersion)
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

const copyTemplate = (dir, styleguideVersion, templateName) => {
  fs.copy(`${__dirname}/templates/v${styleguideVersion}/${templateName}`, dir, error => {
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
  const dirIsEmpty = fs.readdirSync(dir).length === 0

  console.log(`
${chalk.black.bgWhite(' Front End Styleguide Initialization ')}
`)

  const schema = {
    properties: {
      overwriteDir: {
        description: 'Directory is not empty. Continue and delete files (except .git and node_modules) [yes/no]',
        message: 'Please answer with yes or no.',
        type: 'string',
        pattern: /^(y[es]*|n[o]?)$/,
        default: 'no',
        required: true,
        ask: () => !dirIsEmpty,
        before: (value) => {
          if (value.match(/^(n|no)$/)) {
            console.error('Initialization cancelled!')
            process.kill(process.pid)
          }
          return value
        }
      },
      styleguideVersion: {
        description: 'Select Styleguide version [2, 3]',
        message: 'Currently available: 2, 3.',
        type: 'string',
        pattern: /^[23]$/,
        default: '3',
        required: true,
        before: (value) => {
          return parseInt(value)
        }
      },
      styleguideTemplate: {
        description: 'Select project template [example, bare]',
        message: 'Available templates: example, bare.',
        type: 'string',
        pattern: /^(example|bare)$/,
        default: 'example',
        required: true
      },
      projectName: {
        description: 'Project name',
        message: 'The project name has to be lowercase, can contain dashes but no spaces.',
        type: 'string',
        pattern: /^[^_][a-z\d-_]{1,213}$/,
        default: path.parse(dir).name.toLowerCase().replace(/[^a-z\d-_]/, '-'),
        required: true
      },
      projectDescription: {
        description: 'Project description',
        message: 'Every project should have a short description.',
        type: 'string',
        required: true
      },
      projectVersion: {
        description: 'Project version',
        message: 'The version has to follow Semantic Versioning (http://semver.org).',
        type: 'string',
        pattern: /^\d+\.\d+\.\d+$/,
        default: '1.0.0',
        required: true
      },
      authorName: {
        description: 'Author name',
        message: 'Every project should have an author.',
        type: 'string',
        required: true
      },
      authorEmail: {
        description: 'Author email',
        message: 'Please enter a valid email address.',
        type: 'string',
        pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/i,
        required: true
      }
    }
  }

  // Remove prompt question prefix
  prompt.message = null

  prompt.get(schema, (error, result) => {
    if (error) {
      return console.error(error.message)
    }

    if (!result) {
      return console.error('Initialization cancelled!')
    }

    console.log(`
${chalk.green(`Thank you. That's it!`)}
Just wait a few more seconds for the finishing touches.

${chalk.italic('Installing npm packages…')}
`)

    if (result.overwriteDir.match(/^(y|yes)$/)) {
      rimraf(`${dir}/**/*`, { glob: { dot: true, ignore: [`${dir}/.git/**`, `${dir}/node_modules/**`] } }, () => {
        createPackageJSON(dir, result)
        copyTemplate(dir, result.styleguideVersion, result.styleguideTemplate)
      })
    } else {
      createPackageJSON(dir, result)
      copyTemplate(dir, result.styleguideVersion, result.styleguideTemplate)
    }
  })
}
