---
layout: default
title: React Component Properties
step: 8
---
Let's pass some properties to the `HelloWorld` component now!

In `index.jsx`, we'll simply add an attribute to the `<HelloWorld>` tag.

<pre class="brush: js">
var http = require('http')
  , React = require('react')
  , HelloWorld = require('./Components/HelloWorld')

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.end(
    React.renderToString(
      &lt;html&gt;
        &lt;head&gt;
          &lt;title&gt;Hello World&lt;/title&gt;
        &lt;/head&gt;
        &lt;body&gt;
          &lt;HelloWorld from="index.jsx on the server" /&gt;
        &lt;/body&gt;
      &lt;/html&gt;
    )
  )
}).listen(1337)
console.log('Server running at http://localhost:1337/')
</pre>

Within the `Components/HelloWorld.jsx`, we'll make use of that `from` property.

<pre class="brush: js">
var React = require('react')

module.exports = React.createClass({
  render: function() {
    return (
      &lt;div&gt;
        &lt;div&gt;
          This is from the HelloWorld.jsx
          component render function.
        &lt;/div&gt;
        &lt;div&gt;
          Rendered from: {this.props.from}
        &lt;/div&gt;
      &lt;/div&gt;
    )
  }
})
</pre>

There's a noteworthy React/JSX tip to talk about here: Parse Error: "Adjacent JSX elements must be wrapped in an enclosing tag."

In the `HelloWorld.jsx` file, I initially used the following code, and it resulted in this Adjacent JSX elements error.

<pre class="brush: js">
var React = require('react')

module.exports = React.createClass({
  render: function() {
    return (
      &lt;div&gt;
        This is from the HelloWorld.jsx
        component render function.
      &lt;/div&gt;
      &lt;div&gt;
        Rendered from: {this.props.from}
      &lt;/div&gt;
    )
  }
})
</pre>

It took a few minutes to understand, but what was happening is the `HelloWorld.jsx` file's return statement had two adjacent `<div>` tags.  This syntax is unsupported; as the error message explains, the output must be wrapped in an outer element--I just wrapped the two `<div>` elements in an outer `<div>`, as seen above in the working code.

[Next » Running React on the Client](09-react-client)
