---
layout: default
title: Gulp Runs Node
step: 4
---
We can add in our `node` task, declare that it depends on the `jsx` task, and then make the default task start up our `node` task.

<pre class="brush: js">
var gulp = require('gulp')
  , fs = require('fs')
  , reactTools = require('react-tools')
  , spawn = require('child_process').spawn

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

gulp.task('node', ['jsx'], function() {
  spawn('node', ['./lib/index.js'], { stdio: 'inherit'})
})

gulp.task('default', function() {
  gulp.start('node')
})
</pre>

We can still improve this though, simplifying our Gulp code and make it automatically restart everything if our JSX code changes.

[Next » Restarting Node When Changes Occur](05-gulp-restart)
