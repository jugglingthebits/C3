#!/usr/bin/env node

import * as program from 'commander';
import * as Path from 'path';
import * as Hapi from 'hapi';
import * as Inert from 'inert';
import * as opn from 'opn';
import * as fs from 'fs';
import startServer from './server';

let packageJson = require('../package.json');

program
    .version(packageJson.version)
    .option('-n, --new', 'Create example c3.json')
    .option('-s, --show', 'Open web app')
    // .option('-P, --pineapple', 'Add pineapple')
    // .option('-b, --bbq-sauce', 'Add bbq sauce')
    // .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
    .parse(process.argv);

// console.log('you ordered a pizza with:');
if (program.new) {
    const workingDir = process.cwd();
    fs.createReadStream(`${__dirname}/../c3.json`)
        .pipe(fs.createWriteStream(`${workingDir}/c3.json`));
} else if (program.show) {
    startServer(() => {
        opn('http://localhost:3000');
    });
} else {
    program.outputHelp();
}

// if (program.pineapple) console.log('  - pineapple');
// if (program.bbqSauce) console.log('  - bbq');
// console.log('  - %s cheese', program.cheese);
