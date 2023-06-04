var gulp = require("gulp");
var tslint = require("gulp-tslint");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var sourcemaps = require("gulp-sourcemaps");
var del = require("del");

//-----------------------------------------------------

// Decalrations

var paths = {
  files: ['package.json', 'README.md', 'LICENSE'],
  srcStyles: 'styles/css/**/*',
  srcViews: 'views/**/*',
  dist: 'dist',
  distAssets: 'dist/assets',
  distViews: 'dist/views',
  tslint: 'tsconfig.json'
};

//-----------------------------------------------------

// Common gulp tasks:

// TSLint
gulp.task('ts-lint', () =>
  gulp
    .src(paths.srcTS)
    .pipe(tslint(paths.tslint))
    .pipe(tslint.report())
);

// Clean temp and dist folder
gulp.task("clean", async function () {
  del([paths.dist]);
});

//-----------------------------------------------------

// Build pipeline
// Copy tasks

// TS files
gulp.task("typescript:dist", async function () {
  var tsResult = tsProject.src()
    .pipe(tsProject());

  return tsResult.js.pipe(gulp.dest(paths.dist));
});

gulp.task("typescript:dist", function () {
  return tsProject
    .src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist));
});

// Additional project files
gulp.task("additional:dist", function () {
  return gulp.src(paths.files).pipe(gulp.dest(paths.dist));
});


// Default assets project files
gulp.task('assets:dist', function () {
  return gulp.src(paths.srcStyles)
    .pipe(gulp.dest(paths.distAssets));
});


// Default views project files
gulp.task('views:dist', function () {
  return gulp.src(paths.srcViews)
    .pipe(gulp.dest(paths.distViews));
});


// Copy tasks bundle
gulp.task('copy:dist', gulp.parallel(
  'assets:dist',
  'views:dist',
  'additional:dist',
  'typescript:dist', async function () {}));

// Build app to `dist`: Starting point
gulp.task(
  "build",
  gulp.series("clean", "copy:dist", async function () {})
);


// Gulp default starting point
gulp.task(
  "default",
  gulp.parallel("build", async function () {})
);
