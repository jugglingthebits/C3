import * as gulp from 'gulp';
import * as changedInPlace from 'gulp-changed-in-place';
import * as sourcemaps from 'gulp-sourcemaps';
import * as less from 'gulp-less';
import * as plumber from 'gulp-plumber';
import * as notify from 'gulp-notify';
import { build } from 'aurelia-cli';

const project = require('../aurelia.json');

export default function processCSS() {
  return gulp.src(project.cssProcessor.source)
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(build.bundle());
}
