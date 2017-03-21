import * as gulp from 'gulp';
import * as htmlmin from 'gulp-htmlmin';
import * as changedInPlace from 'gulp-changed-in-place';
import { build } from 'aurelia-cli';

const project = require('../aurelia.json');

export default function processMarkup() {
    return gulp.src(project.markupProcessor.source)
        .pipe(changedInPlace({ firstPass: true }))
        .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true
        }))
        .pipe(build.bundle());
}