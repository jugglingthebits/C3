#!/usr/bin/env node

import * as program from 'commander';
import * as Path  from 'path';
import * as Hapi from 'hapi';
import * as Inert from 'inert';
import * as opn from 'opn';
let packageJson = require('../package.json');

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

const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, '..')
            }
        }
    }
});
server.connection({ port: 3000, host: 'localhost', uri: 'http://localhost:3000/index.html' });
server.register(Inert, (err) => {
    if (err) {
        throw err;
    }
    server.route({
        method: 'GET',
        path: '/index.html',
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
opn('http://localhost:3000/index.html');
