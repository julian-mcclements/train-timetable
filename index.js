'use strict';
const program = require('commander');
const app = require('./src/app');

program
  .version('0.1')
  .option('-i, --input <path>','Input file path')
  .parse(process.argv);

console.log('---- program.input ----', program.input);

app.run(program.input);