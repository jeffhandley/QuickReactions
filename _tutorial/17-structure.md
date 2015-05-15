---
layout: default
title: Project Structure
step: 17
---
Here's what I did to achieve a structure that I'm able to grasp a bit better.

1. Create a `/src` folder that will hold source files that will be built/transformed
1. Move the `/Components` folder to `/src/Components`
1. Move the `/assets/index.js` file to `/src/Pages/index.jsx`
    - We introduced 'Pages' here because that's really what this file was for--page-specific scripts
    - Renaming to a .jsx file positions us for using JSX too, even though we're not yet doing so
1. Move the `/index.jsx` file to `/src/server.jsx`
    - "server" is really a more appropriate name
    - We'll reserve "index" for pages
1. Delete the `/lib` folder to get rid of the stale files that were generated
1. Create a `/bin` folder that we'll start to use instead of `/lib`

The `gulpfile.js` needs to be updated to reflect the changes.

<pre class="brush: js">
var gulp = require('gulp')
  , gulpReact = require('gulp-react')
  , gulpNodemon = require('gulp-nodemon')
  , gulpWatch = require('gulp-watch')
  , source = require('vinyl-source-stream')
  , browserify = require('browserify')

gulp.task('watch-jsx', ['build'], function() {
    gulpWatch('src/**/*.jsx', { ignored: 'bin/' }, function() {
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
</pre>

After killing the running Gulp process, ensuring the `/lib` folder is deleted, and restarting Gulp, everything should be back to working.  This gives us a new structure that will be easier to work with.

<pre>
    /                   - Configuration and other general files
    /src                - Source files that will be built/transformed
    /src/Components     - React JSX components
    /src/Pages          - Script files with page-specific code
    /bin                - Build/transform output
    /bin/Components     - React components after JSX transform
    /bin/Pages          - Page-specific script files ready for use in the browser
</pre>

We'll make a couple of little housekeeping changes to tidy things up.  In `/src/server.jsx`, we should change the message passed to the `<HelloWorld>` component.

<pre class="brush: js">
&lt;HelloWorld from="server.jsx, running on the server"&gt;&lt;/HelloWorld&gt;
</pre>

And then in `/src/Pages/index.jsx`, we'll make a change to the message it passes to the HelloWorld component too.

<pre class="brush: js">
var helloInstance = React.createFactory(HelloWorld)( { from: "index.jsx, transformed and running on the client" } );
</pre>

[Next » Using JSX for the Pages](18-jsx-pages)
