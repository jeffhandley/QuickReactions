---
layout: default
title: React on the Client
step: 9
---
On the server, we now have JSX automatically transforming into JS files, and we're using React to render a container page that uses a component, passing state into that component.  Now it's time to introduce React on the client!

React on the client is where many tutorials start out; this was backwards from my own needs where server rendering was more critical and client rendering was an added bonus.  While our end result will involve rendering the same component on the server and client, we'll start out by rendering server and client components separately to make sure we understand each concept in isolation before combining them.

Just like we did on the server, we'll start off using React on the client *without* the JSX syntax.  We'll first create a new file at `Components/Timestamp.js` with the following code.

<pre class="brush: js">
var Timestamp = React.createClass({
  render: function() {
    return React.createElement("div", null, new Date().toString())
  }
})
</pre>

This will serve as the foundation for our `Timestamp` component; we'll render this script inline within our HTML to start out.  To do that, we'll add the inline script to the response we're emitting from Node by editing the `index.jsx` file as follows.

<pre class="brush: js">
var http = require('http')
  , React = require('react')
  , HelloWorld = require('./Components/HelloWorld')
  , fs = require('fs')

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'})
  var body = React.renderToString(
      &lt;body&gt;
      &lt;HelloWorld from="index.jsx on the server"&gt;&lt;/HelloWorld&gt;
      &lt;div id="reactContainer" /&gt;
    &lt;/body&gt;)

  res.end('&lt;html&gt;&lt;head&gt;&lt;title&gt;Hello World&lt;/title&gt;' +
    '&lt;script src="//fb.me/react-0.13.1.js"&gt;&lt;/script&gt;' +
    '&lt;/head&gt;' +
    '&lt;script&gt;' +
    fs.readFileSync('./Components/Timestamp.js') +
    '&lt;/script&gt;' +
    body +
    '&lt;/html&gt;'
  )

}).listen(1337)
console.log('Server running at http://localhost:1337/')
</pre>

You might be wondering why we're not just referencing `Timestamp.js` through a `<script src="/Components/Timestamp.js"></script>` tag.  That's because we don't have any routing in place--all requests, regardless of URL, are getting the same response.  Don't worry though, we'll introduce some routing soon enough so that this file can get served up separately.

Okay, if you load the page with this in place you should see the inline JavaScript, but we're not doing anything with it yet.  Let's render this component using `React.render`.

<pre class="brush: js">
var http = require('http')
  , React = require('react')
  , HelloWorld = require('./Components/HelloWorld')
  , fs = require('fs')

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'})
  var body = React.renderToString(
    &lt;body&gt;
      &lt;HelloWorld
      from="index.jsx on the server"&gt;
      &lt;/HelloWorld&gt;
      &lt;div id="reactContainer" /&gt;
    &lt;/body&gt;)

  res.end('&lt;html&gt;&lt;head&gt;&lt;title&gt;Hello World&lt;/title&gt;' +
    '&lt;script src="//fb.me/react-0.13.1.js"&gt;&lt;/script&gt;' +
    '&lt;/head&gt;' +
    '&lt;script&gt;' +
    fs.readFileSync('./Components/Timestamp.js') +
    '&lt;/script&gt;' +
    body +
    '&lt;script&gt;' +
    'var timestampInstance = React.createFactory(Timestamp)();' +
    'setInterval(function() { ' +
    '    React.render(timestampInstance, ' +
    '        document.getElementById("reactContainer")) }, 500)' +
    '&lt;/script&gt;' +
    '&lt;/html&gt;'
    )

}).listen(1337)
console.log('Server running at http://localhost:1337/')
</pre>

There are a few things to note here:

1. The script for rendering the component needs to be below the rest of the body of the page so that the "reactContainer" element exists.
1. We are using `React.createFactory(Timestamp)()` to get an instance of our component. Without this approach, React warns us about using components directly--using either JSX or a factory is what is suggested.
1. We are forcing the re-rendering of the component within our interval--we should instead use the component's state and just update its state to let React handle rendering.

[Next » Updating Client-Side State](10-react-state)
