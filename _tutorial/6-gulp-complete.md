---
layout: default
title: Completing the Gulp Workflow
step: 6
---
To bring this all together, we need to get Gulp to watch our `index.jsx` file and call our `jsx` task whenever the file is touched. Then we run Gulp once and freely edit the `index.jsx` file and have the changes pick up automatically.

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
            <html>
                <head>
                    <title>Hello World</title>
                </head>
                <body>
                    index.jsx, automatically processed through gulp and gulp-react,
                    with node automatically restarted through gulp-nodemon!
                </body>
            </html>
        )
    )
}).listen(1337)
console.log('Server running at http://localhost:1337/')
</pre>

[Next » Creating a React Component](7-react-component)
