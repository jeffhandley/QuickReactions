---
layout: default
title: React Components
step: 7
---
With Gulp running, let's create a new component and watch it automatically get transformed from a JSX file into a JS file under the `lib` folder.

Here is the component we'll create as the `Components/HelloWorld.jsx` file.

<pre class="brush: js">
var React = require('react')

module.exports = React.createClass({
  render: function() {
    return (
      &lt;div&gt;
        This is from the HelloWorld.jsx
        component render function.
      &lt;/div&gt;
    )
  }
})
</pre>

Now we will use this component from within `index.jsx` by first adding a `require` statement and then using an html-like JSX tag to reference the component.

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
          &lt;HelloWorld /&gt;
          &lt;div&gt;
            Rendered from the Server!
          &lt;/div&gt;
        &lt;/body&gt;
      &lt;/html&gt;
    )
  )
}).listen(1337)
console.log('Server running at http://localhost:1337/')
</pre>

Notice that in the `require` statement, we omit the file extension--the .js extension will be used automatically.  It's noteworthy that we've created the component as `Components/HelloWorld.jsx` but it will get transformed into `lib/Components/HelloWorld.js`.  Likewise, even though we're writing code in `index.jsx`, it will be running from `lib/index.js` where its relative path reference to `./Components/HelloWorld` will result in finding `lib/Components/HelloWorld.js`.  At first, I thought there would be some gymnastics or inconsistencies surfacing here, but since `require` infers the `.js` file extension, it comes together pretty cleanly.

[Next » Passing Properties to Components](08-react-properties)
