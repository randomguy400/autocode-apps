const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

const variable = 'history'

if (variable.toLowerCase() !== variable)  {
  console.log('true')
}