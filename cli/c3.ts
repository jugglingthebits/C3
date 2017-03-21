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
    .parse(process.argv);

const workingDir = process.cwd();
const userC3jsonPath = `${workingDir}/c3.json`;

function startWebApp() {
    startServer(() => {
        opn('http://localhost:3000');
    });
}

if (program.new) {
    fs.createReadStream(`${__dirname}/../c3.json`)
        .pipe(fs.createWriteStream(userC3jsonPath));
} else if (program.show) {
    if (!fs.existsSync(userC3jsonPath)) {
        console.error("c3.json file not found");
        process.exit(1);
    }
    startWebApp();
} else {
    if (fs.existsSync(userC3jsonPath)) {
        startWebApp();
    } else {
        program.outputHelp();
    }
}
