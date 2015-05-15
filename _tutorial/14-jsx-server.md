---
layout: default
title: Server-Side JSX Processing for the Client
step: 14
---
We should go ahead and follow the warning's guidance though, and convert over to the other approach: Let's convert the JSX to JS on the server (as part of our build process), and get back to serving it as raw JavaScript instead of JSX.

If you were watching closely when you renamed `/Components/Timestamp.js` to `/Components/Timestamp.jsx`, you might have noticed that Gulp *already* did this work for us and `/lib/Components/Timestamp.js` showed up automatically!

This happened because of the "jsx" and "watch-jsx" Gulp tasks that we configured earlier:

<pre class="brush: js">
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
</pre>

So in order to get to where we're using JSX components in the browser, but as raw JavaScript, we don't have much to do.

1. Serve components from the `/lib/Components` folder instead of the `/Components` folder
1. Change the `<script>` tag back to `/Components/Timestamp.js`
1. Remove the `text/jsx` script types
1. Remove the JSXTransformer script tag too

Here's what `index.jsx` looks like after those changes.

<pre class="brush: js">
var React = require('react')
  , HelloWorld = require('./Components/HelloWorld')
  , express = require('express')
  , path = require('path')

var app = express()

app.use('/Components',
  express.static(path.join(__dirname, 'Components')))

app.use('/assets',
  express.static(path.join(path.join(__dirname, '..'),
  'assets')))

app.get('/', function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'})
  var html = React.renderToString(
    &lt;html&gt;
      &lt;head&gt;
        &lt;title&gt;Hello World&lt;/title&gt;
        &lt;script src="//fb.me/react-0.13.1.js"&gt;&lt;/script&gt;
        &lt;script src="/Components/Timestamp.js"&gt;&lt;/script&gt;
      &lt;/head&gt;
      &lt;body&gt;
        &lt;HelloWorld from="index.jsx on the server"&gt;&lt;/HelloWorld&gt;
        &lt;div id="reactContainer" /&gt;
      &lt;/body&gt;
      &lt;script src="/assets/index.js"&gt;&lt;/script&gt;
    &lt;/html&gt;)

    res.end(html)
})

app.listen(1337)
console.log('Server running at http://localhost:1337/')
</pre>

Reloading the page, we see that everything is still working.  But viewing source, we discover that we're once again loading `/Components/Timestamp.js` and that its code is served in raw JavaScript instead of JSX, even though we're maintaining it in JSX.

We've successfully refactored the project to allow us to:

1. Serve static files from the server to the client through Express routing
1. Edit a client-side React Component using JSX syntax, but serve it to the browser as JavaScript
1. Load that client-side react Component into our page, set its state on a timer, and watch React re-render

[Next » Aiming for Isomorphic](15-isomorphic-aim)
