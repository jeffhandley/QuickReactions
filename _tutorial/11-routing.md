---
layout: default
title: Basic Routing
step: 11
---
Okay, I've had enough of the HTML string building.  Let's get some basic routing in on the server so that we can serve files instead.  We'll use `Express` for that.

1. npm install express -save

With `Express` installed, we can now get rid of our raw **http** code, spin up an `Express` server instance instead, and then use `express.static` to serve our static files.  With that in place, we can use a `<script src="..."></script>` tag to get our `Timestamp.js` file down to the browser.  Here's what `index.jsx` looks like after those transformations.

<pre class="brush: js">
var React = require('react')
  , HelloWorld = require('./Components/HelloWorld')
  , express = require('express')
  , path = require('path')

var app = express()

app.use('/Components',
  express.static(path.join(path.join(__dirname, '..'),
  'Components')))

app.get('/', function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'})
  var body = React.renderToString(
    &lt;body&gt;
      &lt;HelloWorld from="index.jsx on the server"&gt;&lt;/HelloWorld&gt;
      &lt;div id="reactContainer" /&gt;
    &lt;/body&gt;)

  res.end('&lt;html&gt;&lt;head&gt;&lt;title&gt;Hello World&lt;/title&gt;' +
    '&lt;script src="//fb.me/react-0.13.1.js"&gt;&lt;/script&gt;' +
    '&lt;script src="/Components/Timestamp.js"&gt;&lt;/script&gt;' +
    '&lt;/head&gt;' +
    body +
    '&lt;script&gt;' +
    'var timestampInstance = React.createFactory(Timestamp)();' +
    'var timestampElement = React.render(timestampInstance, ' +
    '  document.getElementById("reactContainer"));' +
    'setInterval(function() { timestampElement.setState({ ' +
    '  date: "Updated through setState: " ' +
    '  + new Date().toString() }) }, 500)' +
    '&lt;/script&gt;' +
    '&lt;/html&gt;'
  )
})

app.listen(1337)
console.log('Server running at http://localhost:1337/')
</pre>

Notes:

1. The `express.static` call is using `__dirname`, joined with `..`, and then joined with `Components`
1. This is because the *running* code is `/lib/index.js` and not the `/index.jsx`, so we have to correct the paths
1. Additionally, we're serving the static components to the browser to a `/Components` folder

We're also obviously not yet rid of the HTML string building--let's do that now.

[Next » Improving the Server Rendering](12-server-rendering)
