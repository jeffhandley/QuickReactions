---
layout: default
title: Gulp Improves the Workflow
step: 3
---
After running JSX manually once, it's pretty clear that we won't want to keep running that every time we make a change.  Instead of running `JSX` and then `Node` over and over again, we'll use Gulp to automatically run JSX and Node for us.

1. npm install --global gulp
1. npm install --save-dev gulp

We'll need to create a `gulpfile.js` at the root of our project.  Let's start with their skeleton:

<pre class="brush: js">
var gulp = require('gulp');

gulp.task('default', function() {
  // place code for your default task here
});
</pre>

But then we'll create a `jsx` task that will use the `react-tools` package to transform our `index.jsx` file into a `./lib/index.js` file.

<pre class="brush: js">
var gulp = require('gulp')
  , fs = require('fs')
  , reactTools = require('react-tools')

var transform = function(srcFile, destFile, cb) {
  console.log('Reading %s...', srcFile)

  var src = fs.readFile(srcFile, {encoding: 'utf8'}, function(readErr, data) {
    if (readErr) {
      cb(readErr)
    }
    else {
      console.log('Writing %s', destFile)
      fs.writeFile(destFile, reactTools.transform(data), function(writeErr) {
        if (writeErr) {
          cb(writeErr)
        }
        else {
          cb()
        }
      })
    }
  })
}

gulp.task('jsx', function(cb) {
  fs.mkdir('./lib', function(err) {
    transform('index.jsx', './lib/index.js', function(err) {
      cb(err)
    })
  })
})

gulp.task('default', function() {
  gulp.start('jsx')
})
</pre>

Now if we run `gulp` from the terminal, it will run the JSX transformation for us.  We're halfway there; the other half is to make gulp spawn off a Node process for running the created `./lib/index.js` file too.

[Next » Running Node Through Gulp](4-gulp-node)
