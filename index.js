'use strict';



/* DEPENDENCIES
 * ========================================================================== */

const chalk  = require('chalk');
const fs     = require('fs-extra');
const path   = require('path');
const prompt = require('prompt');
const spawn  = require('child_process').spawn;



/* INSTALL DEV DEPENDENCIES
 * ========================================================================== */

let installDevDependencies = (dir) => {
  spawn('npm', [
    'install', '--save-dev',
    'babel-preset-es2015',
    'front-end-styleguide',
    'normalize.css',
    'svgxuse'
  ], {
    cwd: dir,
    shell: true,
    stdio: 'inherit'
  });
};



/* CREATE PACKAGE.JSON
 * ========================================================================== */

let createPackageJSON = (dir, data) => {
  let packageJSON = {
    name: data.projectName,
    description: data.projectDescription,
    version: data.projectVersion,
    scripts: {
      start: './node_modules/.bin/front-end-styleguide',
      development: './node_modules/.bin/front-end-styleguide development',
      preview: './node_modules/.bin/front-end-styleguide preview',
      production: './node_modules/.bin/front-end-styleguide production',
      update: './node_modules/.bin/front-end-styleguide update'
    }
  };

  if (data.authorName) {
    packageJSON.author = `${data.authorName} <${data.authorEmail}>`;
  }

  fs.writeFile(`${dir}/package.json`, JSON.stringify(packageJSON, null, 2), 'utf8', (error) => {
    if (error) {
      return console.error(error);
    }

    installDevDependencies(dir);
  });
};



/* CREATE .GITIGNORE
 * ========================================================================== */

let createGitignore = (dir) => {
  let gitignore =
`# OS specific stuff
Thumbs.db
Desktop.ini
.DS_Store
._*
*~

# Logs
logs
*.log
npm-debug.log*

# Dependency directory
node_modules

# Generated content
dev
prev
dist
`;

  fs.writeFile(`${dir}/.gitignore`, gitignore, (error) => {
    if (error) {
      return console.error(error);
    }
  });
};



/* COPY EXAMPLE CONTENT
 * ========================================================================== */

let copyExampleContent = (dir) => {
  fs.copy(`${__dirname}/init`, dir, (error) => {
    if (error) {
      return console.error(error);
    }
  });
};



/* INITIALIZE NEW PROJECT
 * ========================================================================== */

module.exports = (dir) => {
  console.log(`
${chalk.black.bgWhite(' Front End Styleguide Initialization ')}
`);

  let schema = {
    properties: {
      useWizard: {
        description: 'Generate package.json',
        message: 'Please answer with Y or N.',
        type: 'string',
        pattern: /^(Y|N)$/i,
        default: 'Y',
        required: true,
        before: (value) => {
          return value.toUpperCase() === 'Y';
        }
      },
      projectName: {
        description: 'Project name',
        message: 'The project name has to be lowercase, can contain dashes but no spaces.',
        type: 'string',
        pattern: /^[a-z|-]+$/,
        default: path.parse(dir).name.toLowerCase().replace(/[^a-z|-]/, '-'),
        required: true,
        ask: () => {
          return prompt.history('useWizard').value;
        }
      },
      projectDescription: {
        description: 'Project description',
        type: 'string',
        ask: () => {
          return prompt.history('useWizard').value;
        }
      },
      projectVersion: {
        description: 'Project version',
        message: 'The version has to follow Semantic Versioning (http://semver.org).',
        type: 'string',
        pattern: /^\d+\.\d+\.\d+$/,
        default: '1.0.0',
        required: true,
        ask: () => {
          return prompt.history('useWizard').value;
        }
      },
      authorName: {
        description: 'Author name',
        type: 'string',
        ask: () => {
          return prompt.history('useWizard').value;
        }
      },
      authorEmail: {
        description: 'Author email',
        message: 'Please enter a valid email address.',
        type: 'string',
        pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/i,
        required: true,
        ask: () => {
          return prompt.history('useWizard').value && prompt.history('authorName').value;
        }
      }
    }
  };

  prompt.message = null;

  prompt.get(schema, (error, result) => {
    console.log(`
${chalk.green(`Thank you. That's it!`)}
Just wait a few more seconds for the finishing touches.

${chalk.italic('Installing npm packages…')}
`);

    if (!result.useWizard) {
      installDevDependencies(dir);
    } else {
      createPackageJSON(dir, result);
      createGitignore(dir);
      copyExampleContent(dir);
    }
  });
};
