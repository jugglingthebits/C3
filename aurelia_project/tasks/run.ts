import * as gulp from 'gulp';
import * as browserSync from 'browser-sync';
import * as historyApiFallback from 'connect-history-api-fallback/lib';
import * as project from '../aurelia.json';
import build from './build';
import {CLIOptions} from 'aurelia-cli';
import startServer from '../../server/server';

function onChange(path) {
  console.log(`File Changed: ${path}`);
}

let browserSyncServer;

function reload(done) {
  browserSyncServer.reload();
  done();
}

let serve = gulp.series(
  build,
  startServer,
  done => {
    browserSyncServer = browserSync.create();
    browserSyncServer.init({
      online: false,
      open: false,
      port: 9000,
      logLevel: 'silent',
      proxy: {
        target: 'localhost:3000',
        middleware: [function(req, res, next) { //TODO: historyApiFallback(), 
          res.setHeader('Access-Control-Allow-Origin', '*');
          next();
        }]
      } 
    }, function (err, bs) {
      let urls = bs.options.get('urls').toJS();
      console.log(`Application Available At: ${urls.local}`);
      console.log(`BrowserSync Available At: ${urls.ui}`);
      done();
    });
  }
);

let refresh = gulp.series(
  build,
  reload
);

let watch = function() {
  gulp.watch(project.transpiler.source, refresh).on('change', onChange);
  gulp.watch(project.markupProcessor.source, refresh).on('change', onChange);
  gulp.watch(project.cssProcessor.source, refresh).on('change', onChange);
}

let run;

if (CLIOptions.hasFlag('watch')) {
  run = gulp.series(
    serve,
    watch
  );
} else {
  run = serve;
}

export default run;
