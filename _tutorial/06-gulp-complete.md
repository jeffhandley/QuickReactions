---
layout: default
title: Complete Gulp Workflow
step: 6
---
To bring this all together, we need to get Gulp to watch our `index.jsx` file and call our `jsx` task whenever the file is touched. Then we'll be able to run Gulp once and freely edit the `index.jsx` file and have the changes pick up automatically. First you'll need to install Gulp Watch:

1. `npm install gulp-watch --save-dev`
2. Then make the following changes to `gulpfile.js`:

<pre class="brush: js">
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
</pre>

Next, run Gulp to see that it starts the server after transforming `index.jsx` into `lib/index.js`.  Then edit `index.jsx` to have the following content.  After saving the file, you'll see that everything automatically reruns.

<pre class="brush: js">
var http = require('http')
var React = require('react')

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.end(
    React.renderToString(
      &lt;html&gt;
        &lt;head&gt;
          &lt;title&gt;Hello World&lt;/title&gt;
        &lt;/head&gt;
        &lt;body&gt;
          index.jsx, automatically processed
          through gulp and gulp-react, with
          node automatically restarted
          through gulp-nodemon!
        &lt;/body&gt;
      &lt;/html&gt;
    )
  )
}).listen(1337)
console.log('Server running at http://localhost:1337/')
</pre>

[Next » Creating a React Component](07-react-components)
