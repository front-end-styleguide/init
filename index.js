const fs = require('fs-extra')
const inquirer = require('inquirer')

const log = require('./lib/log')
const projectInitilization = require('./lib/initialization')

module.exports = dir => {
  fs.ensureDirSync(dir)

  log.introduction()

  const questionOverwrite = require('./lib/questions').overwrite(dir)
  const questionList = require('./lib/questions').list(dir)

  inquirer.prompt(questionOverwrite).then(answers => {
    if (('overwrite' in answers) && !answers.overwrite) {
      log.cancellation()
    } else {
      inquirer.prompt(questionList).then(answers => {
        projectInitilization(dir, answers)

        log.conclusion()
      })
    }
  })
}
