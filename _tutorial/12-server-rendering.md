---
layout: default
title: Improved Server Rendering
step: 12
---
My first attempt to clean up the server rendering resulted in the following `index.jsx` file.

**But be warned: *this didn't work***

<pre class="brush: js">
var React = require('react')
  , HelloWorld = require('./Components/HelloWorld')
  , express = require('express')
  , path = require('path')

var app = express()
app.use('/Components', express.static(path.join(path.join(__dirname, '..'),
  'Components')))

app.get('/', function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'})
  var elementCode = 'var timestampElement = React.render(timestampInstance, document.getElementById(\'reactContainer\'))'
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
      &lt;script&gt;
      var timestampInstance = React.createFactory(Timestamp)();
      var timestampElement = React.render(timestampInstance, document.getElementById("reactContainer"));
      setInterval(function() { timestampElement.setState({
        date: "Updated through setState: " + new Date().toString() }) }, 500)
      &lt;/script&gt;
    &lt;/html&gt;)

  res.end(html)
})

app.listen(1337)
console.log('Server running at http://localhost:1337/')
</pre>

Trying to run this results in a broken page and an error visible on the console:

`ReferenceError: timestampElement is not defined`

This confused me for a while, but after some investigation (removing some of the inline script and building it back up), I found that the JSX parser is trying to process the contents of the `<script>` tag.  When the `setInterval` statement is evaluated, the `{ timestampElement.setState...` is actually processed on the server!

Additionally, I saw that the `document.getElementById("reactContainer")` statement's quotes were also getting escaped by the rendering, and I couldn't find a straight-forward day to address that.

Ugh - so I've now learned that combining inline `<script>` tags and JSX is not a good recipe.  We'll need a different approach.  We'll go with a simple solution for the moment and just extract that code out into a separate JS file--one specifically for this page.

Let's create a top-level `assets` folder and create this file as `assets/index.js`.

<pre class="brush: js">
var timestampInstance = React.createFactory(Timestamp)();
var timestampElement = React.render(timestampInstance, document.getElementById("reactContainer"));
setInterval(function() { timestampElement.setState({ date: "Updated through setState: " + new Date().toString() }) }, 500)
</pre>

Then we'll update our `index.jsx` file for Express to also serve static assets from our `assets` folder, and then we'll change our inline `<script>` tag over to `<script src="/assets/index.js"></script>`.

<pre class="brush: js">
var React = require('react')
  , HelloWorld = require('./Components/HelloWorld')
  , express = require('express')
  , path = require('path')

var app = express()

app.use('/Components',
  express.static(path.join(path.join(__dirname, '..'),
  'Components')))

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

Now the page is working again!

[Next » Using JSX for Client Components](13-jsx-client)
