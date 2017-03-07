#!/usr/bin/env node

import * as program from 'commander';
let packageJson = require('../package.json');
const Path = require('path');

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

import * as Hapi from 'hapi';
const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, '..')
            }
        }
    }
});

server.connection({ port: 3000, host: 'localhost' });
server.register(require('inert'), (err) => {
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
    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log(`Server running at: ${server.info.uri}`);
    });
});