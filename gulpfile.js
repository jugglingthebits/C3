const gulp = require('gulp');
const ts = require('gulp-typescript');
const changedInPlace = require('gulp-changed-in-place');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

function buildTypeScript() {
    typescriptCompiler = ts.createProject('tsconfig.cli.json', {
        "typescript": require('typescript')
    });

    let src = gulp.src("cli/**/*.ts")
        .pipe(changedInPlace({ firstPass: true }));

    return src
        .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
        .pipe(sourcemaps.init())
        .pipe(typescriptCompiler())
        .pipe(gulp.dest('./cli'));
}

gulp.task('default', function() {
    return buildTypeScript();
});
