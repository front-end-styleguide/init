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

Please install all dependencies with {bold yarn} or {bold npm install}.
Then run the styleguide with {bold yarn start} or {bold npm start}.

If you have the styleguide CLI installed start with {bold front-end-styleguide}.

`)
}
