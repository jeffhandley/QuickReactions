---
layout: default
title: Final Cleanup
step: 20
---
While we've reached the isomorphic goal, we have a lingering problem: Our client-side re-render is yielding a different component tree from our server-side rendering. This causes us to lose the benefits of React's checksum comparisons and we're actually re-rendering the entire DOM instead of just hooking up client-side events.  Fortunately, React was nice enough to give us a warning in the JavaScript console to tell us about this--now we can fix it!

## So what's happening?
If you look back at the source of the page that was rendered from the server, you can see that the entire HTML tree had react attributes sprinkled throughout.

<pre class="brush: html">
&lt;html data-reactid=".1hcyssffzeo" data-react-checksum="1801386867"&gt;
  &lt;head data-reactid=".1hcyssffzeo.0"&gt;
    &lt;title data-reactid=".1hcyssffzeo.0.0"&gt;Hello World&lt;/title&gt;
  &lt;/head&gt;
  &lt;body data-reactid=".1hcyssffzeo.1"&gt;
    &lt;div id="reactContainer" data-reactid=".1hcyssffzeo.1.0"&gt;&lt;/div&gt;
    &lt;div id="reactHelloContainer" data-reactid=".1hcyssffzeo.1.1"&gt;
      &lt;div data-reactid=".1hcyssffzeo.1.1.0"&gt;
        &lt;div data-reactid=".1hcyssffzeo.1.1.0.0"&gt;
          This is from the HelloWorld.jsx component&#x27;s render function.
        &lt;/div&gt;
        &lt;div data-reactid=".1hcyssffzeo.1.1.0.1"&gt;
          &lt;span data-reactid=".1hcyssffzeo.1.1.0.1.0"&gt;
            Rendered from:
          &lt;/span&gt;
          &lt;span data-reactid=".1hcyssffzeo.1.1.0.1.1"&gt;
            server.jsx, running on the server
          &lt;/span&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/body&gt;
  &lt;script src="/pages/index.js" data-reactid=".1hcyssffzeo.2"&gt;&lt;/script&gt;
&lt;/html&gt;
</pre>

Even the `<html>` tag itself got a `data-reactid` attribute.  This is because `server.jsx` used `React.renderToString()` around the entire block of HTML for rendering the page, and `React.renderToString()` then adds the `data-reactid` and `data-react-checksum` attributes to all elements within the tree, because within JSX, even `<html>` is actually a React component.

## Why is that a problem?
Our client-side code is treating the markup of the page differently.  Instead of treating the `<html>` and `<body>` tags as React components, our client-side code is only working with a `<Timestamp>` and a `<HelloWorld>`, and it is rendering those components directly into the target `<div>` elements.

The end result is that React sees that we are stomping over top of the DOM directly, overwriting the contents of a `<div>` element that it rendered as a React component.  React is expecting us to use the same component hierarchy on both the server and the client--we've violated that.

## Synchronizing the component hierarchy
There are two ways to address this:

1. Update the client-side component hierarchy to match up with the server's
1. Update the server-side component hierarchy to match up with the client's

Because the client-side code has no way of re-rendering the `<html>` tag as a React component (it wouldn't have a container element to render it into), we have to go with option 2.  We'll modify our server rendering to no longer treat the shell of the page as React components.

## Creating a Layout Component
The first step is to take the HTML layout that we had inline within `server.jsx` and extract a Layout component.  We'll create a new `src/Components/Layout.jsx` file with the following code.

<pre class="brush: html">
var React = require('react');

module.exports = React.createClass({
    render: function() {
        return (
            &lt;html&gt;
                &lt;head&gt;
                    &lt;title&gt;Hello World&lt;/title&gt;
                &lt;/head&gt;
                &lt;body&gt;
                    &lt;div id="reactContainer" /&gt;
                    &lt;div id="reactHelloContainer"
                        dangerouslySetInnerHTML={{__html: this.props.content}} /&gt;
                &lt;/body&gt;
                &lt;script src="/pages/index.js"&gt;&lt;/script&gt;
            &lt;/html&gt;
        )
    }
})
</pre>

This component came over from `server.jsx` almost verbatim--there's just one critical difference.  Where we previously had the `<HelloWorld>` component within the `reactHelloContainer`, we have removed that and added some code.

`<div id="reactHelloContainer" dangerouslySetInnerHTML={{__html: this.props.content}} />`

Let's examine this:

1. dangerouslySetInnerHTML is a React base component property name
    1. It does exactly what it says--it lets you force raw HTML into a React component's inner HTML
    1. This is dangerous because you must protect yourself against encoding issues like cross-site scripting vulnerabilities
1. This property requires a value in the structure of an object with an `__html` property
    1. We are setting the `__html` property value to be `this.props.content`

The result is that our `Layout` component will receive a `content` property as raw HTML, and it will inject that (dangerous) HTML into the layout in the right spot.

## Using the Layout Component
We need to modify `server.jsx` to use this new `Layout` component.

<pre class="brush: js">
var React = require('react')
  , Layout = require('./Components/Layout')
  , HelloWorld = require('./Components/HelloWorld')
  , express = require('express')
  , path = require('path')

var app = express()
app.use('/pages', express.static(path.join(__dirname, 'Pages')))

app.get('/', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    var content = React.renderToString(
        &lt;HelloWorld from="server.jsx, running on the server" /&gt;
    )

    var html = React.renderToStaticMarkup(
        &lt;Layout content={content} /&gt;
    )

    res.end(html)
})

app.listen(1337)
console.log('Server running at http://localhost:1337/')
</pre>

We're doing a few new things here:

1. We're rendering the `<HelloWorld>` component on its own, using `React.renderToString()`
    1. Remember, `renderToString()` produces HTML that is marked up with React attributes
    1. That means the `<HelloWorld>` component output will be ready to become isomorphic
    1. And some good news is that `renderToString()` also handles the HTML encoding that we were worrying about a minute ago
1. We're taking the HTML from the `<HelloWorld>` component and passing it into the new `<Layout>` component as the `content` property
1. We're getting the HTML of the `<Layout>` component from `React.renderToStaticMarkup()`
    1. This method produces HTML that *is not* intended to be treated as React components
    1. But since the inner HTML that we've passed in was already marked up with React attributes, those attributes will remain

The end result is that the shell of the application will no longer act as isomorphic React components--only the inner HTML that was produced from the `<HelloWorld>` will be.  Perfect!

## One Last Detail
After making these changes and running the application, you'll see that we still get a warning from React about client and server markup differing.

<pre>
Warning: React attempted to reuse markup in a container but the checksum was invalid. This generally means that you are using server rendering and the markup generated on the server was not what the client was expecting. React injected new markup to compensate which works but you have lost many of the benefits of server rendering. Instead, figure out why the markup being generated is different on the client or server:
 (client) d=".1d0buihxxc.1.1">index.jsx, transform
 (server) d=".1d0buihxxc.1.1">server.jsx, running
</pre>

We can see just enough here to understand where this difference is: the `from` message we're rendering from the client is different from the message from the server.

In `server.jsx`, we construct the `HelloWorld` component like this:

`<HelloWorld from="server.jsx, running on the server" />`

But in `index.jsx` (the client-side code), we construct it with:

`<HelloWorld from='index.jsx, transformed, bundled, and running on the client' />`

When we're performing our initial client-side rendering, React expects the entire tree to match up perfectly so that no DOM elements have to be re-rendered.  We're still violating that.  But with a simple change to `index.jsx`, we can have our initial rendering match the server exactly, but then still illustrate how events on the client can re-render the page in our isomorphic mode.

Here is the revised `index.jsx`.

<pre class="brush: js">
var React = require('react')
var HelloWorld = require('../Components/HelloWorld')
var Timestamp = require('../Components/Timestamp')

var helloWorldElement = React.render(
    &lt;HelloWorld from='server.jsx, running on the server' /&gt;,
    document.getElementById('reactHelloContainer'))

var timestampElement = React.render(
    &lt;Timestamp /&gt;,
    document.getElementById('reactContainer'))

setInterval(function() {
    helloWorldElement.setState({ from: "index.jsx, transformed, bundled, and running on the client" })
    timestampElement.setState({ date: "Updated through setState: " + new Date().toString() })
}, 500)
</pre>

We've changed the `from` message to match the server's, but in our `setTimeout`, we set the state of the `helloWorldElement` to reflect the client-side rendering.  With this in place, the application runs and we see our isomorphic behavior without any React warnings.

## Conclusions
This last round of hiccups emphasizes an important concept with isomorphic React components: **The client should modify the state of components initially rendered from the server rather than rendering its own components.**  Our end result left us with a client-side `index.jsx` that rendered the same initial state of our isomorphic component as the `server.jsx` did on the server.  That put us in a good place, and the client can now re-render whenever the state of the components change.

It has been an interesting journey from creating a simple HTTP server in Node.js to having an isomorphic React component--I hope you've enjoyed working through it as much as I did!

[Finished » References](references)
