const gitConfigPath = require('git-config-path')
const parseGitConfig = require('parse-git-config')

exports.local = parseGitConfig.sync({
  cwd: '/',
  path: gitConfigPath({ cwd: __dirname })
})

exports.global = parseGitConfig.sync({
  cwd: '/',
  path: gitConfigPath('global')
})
