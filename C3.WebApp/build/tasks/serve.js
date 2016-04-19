var gulp = require('gulp');
var browserSync = require('browser-sync');
var proxy = require('http-proxy-middleware');

var apiProxy = proxy('/api', {
  target: 'http://localhost:5000', 
  logLevel: 'debug'
});

// this task utilizes the browsersync plugin
// to create a dev server instance
// at http://localhost:9000
gulp.task('serve', ['build'], function(done) {
  browserSync({
    online: false,
    open: false,
    port: 9000,
    server: {
      baseDir: ['.'],
      middleware: [
        function(req, res, next) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          next();
        },
        apiProxy
      ]
    }
  }, done);
});

// this task utilizes the browsersync plugin
// to create a dev server instance
// at http://localhost:9000
gulp.task('serve-bundle', ['bundle'], function(done) {
  browserSync({
    online: false,
    open: false,
    port: 9000,
    server: {
      baseDir: ['.'],
      middleware: [
        function(req, res, next) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          next();
        },
        apiProxy
      ]
    }
  }, done);
});
