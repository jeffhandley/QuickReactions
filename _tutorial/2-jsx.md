---
layout: default
title: React's JSX Syntax
step: 2
---
1. npm install react -save
1. Rename `index.js` to `index.jsx`

Update `index.jsx` to the following:

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
          index.jsx compiled into index.js by hand on the server
        &lt;/body&gt;
      &lt;/html&gt;
    )
  )
}).listen(1337)
console.log('Server running at http://localhost:1337/')
</pre>

## Get the react-tools installed
This will allow us to use React's JSX syntax and compile it to raw JS

1. npm install --global react-tools
1. npm install --save-dev react-tools

## Compile the JSX manually
Now if you run `jsx index.jsx > index.js` the JSX file will be compiled into raw JavaScript.  The output will match the following.

<pre class="brush: js">
var http = require('http')
var React = require('react')

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.end(
    React.renderToString(
      React.createElement("html", null,
        React.createElement("head", null,
          React.createElement("title", null, "Hello World")
        ),
      React.createElement("body", null,
        "index.jsx compiled into index.js by hand on the server")
    ))
  )
}).listen(1337)
console.log('Server running at http://localhost:1337/')
</pre>

You can now run `node index.js` and verify that the server still responds, now with "index.jsx compiled into index.js".  There's one more detail hidden under the covers here though; React has marked up the HTML with React data attributes that will allow React in the browser to understand the components that were rendered on the server.

If you view source in the browser, you'll see something like the following.

<pre class="brush: html">
&lt;html data-reactid=".qa6th1tqf4" data-react-checksum="-1942403816"&gt;
  &lt;head data-reactid=".qa6th1tqf4.0"&gt;
    &lt;title data-reactid=".qa6th1tqf4.0.0"&gt;Hello World&lt;/title&gt;
  &lt;/head&gt;
  &lt;body data-reactid=".qa6th1tqf4.1"&gt;
    index.jsx compiled into index.js by hand on the server
  &lt;/body&gt;
&lt;/html&gt;
</pre>

[Next » Improving Development Workflow with Gulp](3-gulp-workflow)
