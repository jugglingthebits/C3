#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var program = require("commander");
var Path = require("path");
var Inert = require("inert");
var packageJson = require('../package.json');
program
    .version(packageJson.version)
    .parse(process.argv);
// console.log('you ordered a pizza with:');
// if (program.peppers) console.log('  - peppers');
// if (program.pineapple) console.log('  - pineapple');
// if (program.bbqSauce) console.log('  - bbq');
// console.log('  - %s cheese', program.cheese);
var Hapi = require("hapi");
var server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, '..')
            }
        }
    }
});
server.connection({ port: 3000, host: 'localhost' });
server.register(Inert, function (err) {
    if (err) {
        throw err;
    }
    server.route({
        method: 'GET',
        path: '/hello',
        handler: function (request, reply) {
            reply.file('index.html');
        }
    });
    server.route({
        method: 'GET',
        path: '/scripts/{param*}',
        handler: {
            directory: {
                path: 'scripts'
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/styles/{param*}',
        handler: {
            directory: {
                path: 'styles'
            }
        }
    });
    server.start(function (err) {
        if (err) {
            throw err;
        }
        console.log("Server running at: " + server.info.uri);
    });
});
