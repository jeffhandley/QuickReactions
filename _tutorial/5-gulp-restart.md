---
layout: default
title: Gulp Restarts Node Automatically
step: 5
---
We'll use the `gulp-react` package to take over the JSX transformation and the `gulp-nodemon` package to run Node for us.

1. npm uninstall react-tools --save-dev (this is no longer needed as a direct dependency)
1. npm install gulp-react --save-dev

Now, let's rewrite `gulpfile.js` to use gulp-react to process `*.jsx` files and put the output into the `lib` folder.  This is a lot simpler!

<pre class="brush: js">
var gulp = require('gulp')
  , gulpReact = require('gulp-react')

gulp.task('jsx', function() {
    return gulp.src('*.jsx')
               .pipe(gulpReact())
               .pipe(gulp.dest('lib'))
})

gulp.task('default', function() {
    gulp.start('jsx')
})
</pre>

Gulp's piping make this really clean.  And we can now use `gulp-nodemon` to take care of running Node for us.

1. npm install gulp-nodemon --save-dev

With this package in place, we can easily get Node to restart whenever a JS file is updated.  Here's our new `gulpfile.js` with that plugged in.

<pre class="brush: js">
var gulp = require('gulp')
  , gulpReact = require('gulp-react')
  , gulpNodemon = require('gulp-nodemon')

gulp.task('jsx', function() {
    return gulp.src('*.jsx')
               .pipe(gulpReact())
               .pipe(gulp.dest('lib'))
})

gulp.task('node', ['jsx'], function() {
    gulpNodemon({
        script: 'lib/index.js',
        ext: 'js'
    })
})

gulp.task('default', function() {
    gulp.start('node')
})
</pre>

To see the effects of this, try editing the `lib/index.js` file directly and you'll see that nodemon will restart the server for us right away.

[Next » Completing the Gulp Workflow](6-gulp-complete)
