---
layout: default
title: Browserify to Transpile JavaScript
step: 16
---
Node uses something called [CommonJS](http://www.commonjs.org/specs/modules/1.0/) to export and require modules.  This same pattern can be used in the browser if we run our code through a tool called [http://browserify.org/](Browserify).  Browserify will end up taking our code entry point and all of the dependencies needed to give us a bundled JavaScript file that has everything we need.

1. npm install browserify --save-dev

With Browserify installed, the next step will be to rearrange our code so that we are consistently using `module.exports` and `require()`.  In order to get our paths right in our `require()` statements, we'll need to move some files around.

Here are the module consumption scenarios we have:

1. `/assets/index.js` needs:
    1. React
    1. HelloWorld
    1. Timestamp
1. HelloWorld needs:
    React
1. Timestamp needs:
    React

That's not too bad.  But we do have another detail to worry about--we're coding HelloWorld and Timestamp using JSX that is getting transformed to JavaScript.  Browserify can handle transforms, and we'll use that feature shortly, but let's just get this hacked together for a moment (one step at a time).

Here's the approach we'll take in this (temporary) approach:

1. Modify `/Components/Timestamp.jsx` to export its React class using `module.exports`
    1. `/Components/HelloWorld.jsx` is already doing this
1. Modify `/assets/index.js` to use `require` statements for React, HelloWorld, and Timestamp
    1. Require HelloWorld and Timestamp using relative paths from `/assets` to `/lib/Components' where the JS files have already been transformed from JSX
1. Update our `gulpfile.js` to introduce a new "client-scripts" task for running browserify on `/assets/index.js`

Here's what `/Components/Timestamp.jsx` gets edited to.

<pre class="brush: js">
var React = require('react')

module.exports = React.createClass({
    getInitialState: function() {
        return { date: "Initial State: " + new Date().toString() }
    },
    render: function() {
        return <div>{this.state.date}</div>
    }
})
</pre>

Then `/assets/index.js` will pick up proper `require` statements.  The relative paths for getting to our already-transformed components is pretty ugly here, but we'll fix that later.

<pre class="brush: js">
var React = require('react')
var HelloWorld = require('../lib/Components/HelloWorld')
var Timestamp = require('../lib/Components/Timestamp')

var timestampInstance = React.createFactory(Timestamp)();
var timestampElement = React.render(timestampInstance, document.getElementById("reactContainer"));
setInterval(function() { timestampElement.setState({ date: "Updated through setState: " + new Date().toString() }) }, 500)

var helloInstance = React.createFactory(HelloWorld)( { from: "From the client" } );
var helloElement = React.render(helloInstance, document.getElementById("reactHelloContainer"));
</pre>

To illustrate client rendering of the HelloWorld component here, we've added a couple of lines at the bottom of `/assets/index.js` that will do that.  We're rendering the HelloWorld element into a "reactHelloContainer" element--we need to create that.  Here's what `/index.jsx` looks like after adding that `<div>`.

<pre class="brush: js">
var React = require('react')
  , HelloWorld = require('./Components/HelloWorld')
  , express = require('express')
  , path = require('path')

var app = express()
app.use('/Components', express.static(path.join(__dirname, 'Components')))
app.use('/assets', express.static(path.join(path.join(__dirname, '..'), 'assets')))

app.get('/', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    var html = React.renderToString(
                &lt;html&gt;
                    &lt;head&gt;
                        &lt;title&gt;Hello World&lt;/title&gt;
                    &lt;/head&gt;
                    &lt;body&gt;
                        &lt;HelloWorld from="index.jsx on the server"&gt;&lt;/HelloWorld&gt;
                        &lt;div id="reactContainer" /&gt;
                        &lt;div id="reactHelloContainer"&gt;&lt;/div&gt;
                    &lt;/body&gt;
                    &lt;script src="/assets/index.js"&gt;&lt;/script&gt;
                &lt;/html&gt;)

        res.end(html)
})

app.listen(1337)
console.log('Server running at http://localhost:1337/')
</pre>

This should put all of the pieces in place for us:

1. `/Components/Timestamp.jsx` uses `require` to get React
1. `/Components/Timestamp.jsx` uses `module.exports` to export itself
1. `Timestamp.jsx` and `HelloWorld.jsx` are already getting transformed into raw JavaScript
    1. The result gets written to `/lib/Components/`
1. `/assets/index.js` uses `require` to get React, HelloWorld, and Timestamp
    1. It renders a Timestamp component into `<div id="reactContainer">`
    1. It renders a HelloWorld component into `<div id="ReactHelloContainer">`

And as a reminder, there are a few other moving parts:

1. `/index.jsx` gets transformed into raw JavaSCript at `/lib/index.js'
1. We serve static assets from `/lib/Components' under the `/Components' path
1. We serve static assets from `/assets' under the `/assets` path

With this configuration, the page that gets served with a script tag pointing to `/assets/index.js` and that results in our raw `/assets/index.js` file getting to the browser.  That file now has `require()` statements in it and that's where we need to utilize Browserify.

To pull this off, we'll update our `gulpfile.js` and introduce a "client-scripts" task to transform `/assets/index.js` to `/lib/assets/index.js`.

<pre class="brush: js">
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
</pre>

Here are some notes on this step:

1. We require 'browserify'
1. We created a new 'client-scripts' task that depends on the output of the 'jsx' task
1. That task uses `browserify('./assets/index.js').bundle()` to create the bundle
1. We need to specify the source file name on the stream that gulp uses
    1. This is done using the `.pipe(source('index.js'))` statement
    1. That step required running `npm install vinyl-source-stream --save-dev`
    1. And then we also added the `require('vinyl-source-stream')` to use it
1. We then pipe the output of the gulp bundle's stream using `.pipe(gulp.dest('lib/assets'))
1. The 'node' task now depends on 'client-scripts'
1. The 'watch-jsx' task also depends on 'client-scripts'
1. The 'watch-jsx' task passes `/assets/*.js` into `gulpWatch` now too

With all of this in place, we can edit `/assets/index.js` while Node is running and Gulp will re-run browserify through our "client-scripts" task and restart node.

Now there's one last detail we need to take care of: we need the browser to be able to get to the Browserify output.  Right now, it can reach `/lib/Components` and `/assets` but we need it to get to `/lib/assets`.  The good news is that we no longer need direct access to `/assets`.  So let's edit `index.jsx` to serve static content from `/lib/assets/` under the `/assets` path.

**BEFORE**

<pre class="brush: js">
app.use('/assets', express.static(path.join(path.join(__dirname, '..'), 'assets')))
</pre>

**AFTER**

<pre class="brush: js">
app.use('/assets', express.static(path.join(__dirname, 'assets')))
</pre>

Because this file is running from the `/lib` folder, and the Browserify output is now in the `/lib/assets` folder, we were able to get rid of the `..` folder handling and now just serve `/assets` out of the `/lib/assets` folder more cleanly.

After restarting Gulp (to pick up on the new `gulpfile.js` changes), we can load our page back up in the browser and see that this all came together.  The page now shows the following (with the Timestamp updating):

<pre>
This is from the HelloWorld.jsx component's render function.
Rendered from: index.jsx on the server
Updated through setState: Mon Apr 13 2015 16:53:13 GMT-0700 (PDT)
This is from the HelloWorld.jsx component's render function.
Rendered from: From the client
</pre>

I'll admit, this was a lot of work--more than I expected it to be.  And I'm not very happy with the folder layout that we've arrived at:

<pre>
    /assets     - meant for public js/css/image assets
                - now it's a source folder for JavaScript files to be run through Browserify
                - files have to know to use relative path require() statements to get to ../lib
    /Components - JSX-based React components
                - also a source folder where contents will be run through gulp-react
    /lib        - build output from Browserify and gulp-react
    /           - includes index.jsx, which is a source file that runs through gulp-react
</pre>

Before we go any further, we'll want to clean this structure up a bit.

[Next » Cleaning Up the Structure](17-structure)
