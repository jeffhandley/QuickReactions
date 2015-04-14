var gulp = require('gulp')
  , gulpReact = require('gulp-react')
  , gulpNodemon = require('gulp-nodemon')
  , gulpWatch = require('gulp-watch')
  , source = require('vinyl-source-stream')
  , browserify = require('browserify')

gulp.task('watch-jsx', ['client-scripts'], function() {
    gulpWatch(['**/*.jsx', 'assets/*.js'], { ignored: 'lib/' }, function() {
        gulp.start('client-scripts')
    })
})

gulp.task('jsx', function() {
    return gulp.src('**/*.jsx')
               .pipe(gulpReact())
               .pipe(gulp.dest('lib'))
})

gulp.task('client-scripts', ['jsx'], function() {
  return browserify('./assets/index.js').bundle()
    .pipe(source('index.js'))
    .pipe(gulp.dest('lib/assets'))
})

gulp.task('node', ['client-scripts', 'watch-jsx'], function() {
    gulpNodemon({
        script: 'lib/index.js',
        ignore: ['gulpfile.js'],
        ext: 'js jsx'
    })
})

gulp.task('default', function() {
    gulp.start('node')
})