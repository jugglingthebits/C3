#!/usr/bin/env node

import * as program from 'commander';
import * as Path from 'path';
import * as Hapi from 'hapi';
import * as Inert from 'inert';
import * as opn from 'opn';
let packageJson = require('../package.json');
import startServer from './server';

program
    .version(packageJson.version)
    //.option('-p, --peppers', 'Add peppers')
    // .option('-P, --pineapple', 'Add pineapple')
    // .option('-b, --bbq-sauce', 'Add bbq sauce')
    // .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
    .parse(process.argv);

// console.log('you ordered a pizza with:');
// if (program.peppers) console.log('  - peppers');
// if (program.pineapple) console.log('  - pineapple');
// if (program.bbqSauce) console.log('  - bbq');
// console.log('  - %s cheese', program.cheese);

startServer(() => {
    opn('http://localhost:3000/index.html');
});
