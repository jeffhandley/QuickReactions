var gulp = require('gulp')
  , gulpReact = require('gulp-react')
  , gulpNodemon = require('gulp-nodemon')
  , gulpWatch = require('gulp-watch')

gulp.task('watch-jsx', ['jsx'], function() {
    gulpWatch('**/*.jsx', { ignored: 'lib/' }, function() {
        gulp.start('jsx')
    })
})

gulp.task('jsx', function() {
    return gulp.src('**/*.jsx')
               .pipe(gulpReact())
               .pipe(gulp.dest('lib'))
})

gulp.task('node', ['watch-jsx'], function() {
    gulpNodemon({
        script: 'lib/index.js',
        ignore: ['gulpfile.js'],
        ext: 'js jsx'
    })
})

gulp.task('default', function() {
    gulp.start('node')
})