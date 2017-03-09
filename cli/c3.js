#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var program = require("commander");
var opn = require("opn");
var packageJson = require('../package.json');
var server_1 = require("./server");
program
    .version(packageJson.version)
    .parse(process.argv);
// console.log('you ordered a pizza with:');
// if (program.peppers) console.log('  - peppers');
// if (program.pineapple) console.log('  - pineapple');
// if (program.bbqSauce) console.log('  - bbq');
// console.log('  - %s cheese', program.cheese);
server_1["default"](function () {
    opn('http://localhost:3000');
});
