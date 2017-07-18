const rimraf = require('rimraf')

const copyTemplate = require('./copy-template')
const createPackageJSON = require('./create-package-json')

module.exports = (dir, data) => {
  // Exclude .git and node_modules folders
  const rimrafOptions = {
    glob: {
      dot: true,
      ignore: [`${dir}/.git/**`, `${dir}/node_modules/**`]
    }
  }

  // Clean directory and then create package.json and copy template files
  rimraf(`${dir}/**/*`, rimrafOptions, () => {
    copyTemplate(dir, data)
    createPackageJSON(dir, data)
  })
}
