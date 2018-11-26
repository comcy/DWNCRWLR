var gulp = require('gulp');
var tslint = require('gulp-tslint');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');

//-----------------------------------------------------

// Decalrations

var paths = {
  src: 'src/**/*',
  srcViews: ['src/**/*.ejs'],
  srcStylesSass: 'src/styles/scss/**/*.scss',
  srcStylesCss: 'src/styles/css/**/*.css',
  srcJS: 'src/**/*.js',
  srcTS: 'src/**/*.ts',

  dist: 'dist',
  distViews: 'dist/views',
  distStyles: 'dist/styles/css/*.css',
  distJS: 'dist/**/*.js',
  distAssets: 'dist/assets',
  distAssetsStyles: 'dist/styles/css',

  files: ['package.json', 'README.md', 'LICENSE', './src/dwncrwlr.config.json'],
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
gulp.task('clean', function() {
  del([paths.dist]);
});

//-----------------------------------------------------

// Build pipeline
// Copy tasks

// Views: HTML, Templates, ...
gulp.task('views:dist', function() {
  return gulp.src(paths.srcViews).pipe(gulp.dest(paths.distViews));
});

// Styles: CSS, SCSS, ...
gulp.task('styles:dist', function() {
  return gulp
    .src(paths.srcStylesCss)
    .pipe(concat('style.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.distAssetsStyles));
});

gulp.task('sass:dist', function() {
  return gulp
    .src(paths.srcStylesSass)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('ts:dist', function() {
  gulp
    .src('src/**/*.ts')
    .pipe(
      ts({
        noImplicitAny: true,
        out: 'dwncrwlr.js'
      })
    )
    .pipe(gulp.dest('./tmp/ts'));
});

gulp.task('uglify:dist', function() {
  gulp
    .src(['./tmp/ts/dwncrwlr.js'])
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest('./dist/'));
});

// // JS files
// gulp.task('js:dist', function() {
//   return gulp
//     .src(paths.srcJS)
//     .pipe(concat('dwncrwlr.min.js'))
//     .pipe(uglify())
//     .pipe(gulp.dest(paths.dist));
// });

// // TS files
// gulp.task("typescript:dist", function () {
//     return tsProject.src()
//         .pipe(tsProject())
// .js.pipe(gulp.dest(paths.dist));
// });

// Additional project files
gulp.task('additional:dist', function() {
  return gulp.src(paths.files).pipe(gulp.dest(paths.dist));
});

// Copy tasks bundle
gulp.task('copy:dist', [
  'views:dist',
  'styles:dist',
  'ts:dist',
  'uglify:dist',
  // 'js:dist',
  // 'typescript:dist',
  'additional:dist'
]);

// Build app to `dist`: Starting point
gulp.task('build', ['copy:dist']);

// Gulp default starting point
gulp.task('default', ['build'], function() {});
