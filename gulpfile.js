var gulp = require('gulp')
  , gulpReact = require('gulp-react')
  , gulpNodemon = require('gulp-nodemon')
  , gulpWatch = require('gulp-watch')
  , source = require('vinyl-source-stream')
  , browserify = require('browserify')

gulp.task('watch-jsx', ['build'], function() {
    gulpWatch('src/**/*.jsx', function() {
        gulp.start('build')
    })
})

gulp.task('jsx', function() {
    return gulp.src('src/**/*.jsx')
               .pipe(gulpReact())
               .pipe(gulp.dest('bin'))
})

gulp.task('build', ['client-scripts'])

gulp.task('client-scripts', ['jsx'], function() {
  return browserify('./bin/Pages/index.js').bundle()
    .pipe(source('index.js'))
    .pipe(gulp.dest('bin/Pages'))
})

gulp.task('node', ['client-scripts', 'watch-jsx'], function() {
    gulpNodemon({
        script: 'bin/server.js',
        ignore: ['gulpfile.js'],
        ext: 'js jsx'
    })
})

gulp.task('default', function() {
    gulp.start('node')
})