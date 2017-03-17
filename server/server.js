"use strict";
exports.__esModule = true;
var Path = require("path");
var Hapi = require("hapi");
var Inert = require("inert");
function startServer(done) {
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
            path: '/',
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
        server.route({
            method: 'GET',
            path: '/api/system-context/current',
            handler: function (request, reply) {
                reply.file('c3.json');
            }
        });
        server.start(function (err) {
            if (err) {
                throw err;
            }
            console.log("Server running at: " + server.info.uri);
        });
    });
    done();
}
exports["default"] = startServer;
