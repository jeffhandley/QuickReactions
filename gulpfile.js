var gulp = require('gulp')
  , gulpReact = require('gulp-react')

gulp.task('jsx', function(cb) {
    return gulp.src('*.jsx')
               .pipe(gulpReact())
               .pipe(gulp.dest('lib'))
})

gulp.task('default', function() {
    gulp.start('jsx')
})