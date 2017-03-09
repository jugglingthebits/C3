import * as Path from 'path';
import * as Hapi from 'hapi';
import * as Inert from 'inert';

export default function startServer(done) {
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
        server.route({
            method: 'GET',
            path: '/api/system-context/current',
            handler: function (request, reply) {
                reply.file('c3.json');
            }
        });
        server.start((err) => {
            if (err) {
                throw err;
            }
            console.log(`Server running at: ${server.info.uri}`);
        });
    });
    done();
}



