const chalk = require('chalk')

exports.introduction = () => {
  console.log(chalk`

{bold.blue ╔═════════════════════════════════════╗}

{bold.blue ║} {bold Front-End-Styleguide Initialization} {bold.blue ║}

{bold.blue ╚═════════════════════════════════════╝}

`)
}

exports.cancellation = () => {
  console.log(chalk`

{bold.red Initialization cancelled}

`)
}

exports.conclusion = () => {
  console.log(chalk`

{bold.green Thank you, that’s it!}

Please install the dependencies before you take-off.
Installation with Yarn:
  {bold yarn}
or with npm:
  {bold npm install}

Then run the styleguide with:
  {bold front-end-styleguide}

`)
}
