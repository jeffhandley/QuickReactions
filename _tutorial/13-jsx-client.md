---
layout: default
title: JSX for Client Components
step: 13
---
All of that routing business was a bit of a diversion from our task at hand: **Refactor the client-side component to use JSX**

I know that there are 2 ways we can use JSX on the client:

1. Send JSX down to the browser and use React's `JSXTransformer.js` to transform it to JS on the client
1. Transform the JSX on the server and serve raw JS to the client

Since the [ReactJS Starter Kit](http://facebook.github.io/react/docs/getting-started.html#starter-kit) demonstrates the first option, transforming JSX on the client, we'll start with that approach.

Before we convert `Timestamp.js` over to use JSX, let's introduce the JSX Transformer and ensure that the page still works as-is.  Here's the change to `index.jsx`.

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
        &lt;script src="//fb.me/JSXTransformer-0.13.1.js"&gt;&lt;/script&gt;
        &lt;script src="/Components/Timestamp.js" type="text/jsx"&gt;&lt;/script&gt;
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

If we run this, there's an error in the browser: `Uncaught ReferenceError: Timestamp is not defined`

Thinking about what's going on here, we can figure out why this is happening:

1. The React library is served
1. The JSXTransformer library is served
1. The `/Components/Timestamp.js` file is served, as text/jsx, which queues it up for processing by the JSXTransformer
1. The `/assets/index.js` file is served and executed

There's our problem: The code in `/assets/index.js` is getting executed, but the JSXTransformer hasn't yet had an opportunity to process the `/Components/Timestamp.js` file.  There's an easy fix though: Let's just change the `/assets/index.js` script over to also be `text/jsx` so that the JSXTransformer will be responsible for executing that code, and it will do so after executing the `/Components/Timestamp.js` code.

<pre class="brush: js">
&lt;script src="/assets/index.js" type="text/jsx"&gt;&lt;/script&gt;
</pre>

That did the trick.  The page is working again.  While verifying this, I noticed a warning in the browser console though.

`You are using the in-browser JSX transformer. Be sure to precompile your JSX for production - http://facebook.github.io/react/docs/tooling-integration.html#jsx`

Okay, my gut was right--we'll want to do this transform on the server at the end of the day.  But let's finish the conversion over to JSX first.

After renaming `/Components/Timestamp.js` to `/Components/Timestamp.jsx`, its code gets changed to the following:

<pre class="brush: js">
var Timestamp = React.createClass({
  getInitialState: function() {
    return { date: "Initial State: " + new Date().toString() }
  },
  render: function() {
    return &lt;div&gt;{this.state.date}&lt;/div&gt;
  }
})
</pre>

That was only a 1-line change for this component; not bad.  We'll change our `index.jsx` file to reference it as `/Components/Timestamp.jsx` now and see if the JSXTransformer does its job...

**It did!** Refreshing the page, we see that it's still functioning just like it was before.  Huh.  That was pretty anti-climactic, wasn't it?  Viewing source, just to make sure the change actually took effect, we can see that sure enough, the following was rendered:

<pre class="brush: js">
&lt;script src="//fb.me/react-0.13.1.js" data-reactid=".23it8p7ku0w.0.1"&gt;&lt;/script&gt;
&lt;script src="//fb.me/JSXTransformer-0.13.1.js" data-reactid=".23it8p7ku0w.0.2"&gt;&lt;/script&gt;
&lt;script src="/Components/Timestamp.jsx" type="text/jsx" data-reactid=".23it8p7ku0w.0.3"&gt;&lt;/script&gt;
</pre>

Following the link to `/Components/Timestamp.jsx`, we also get confirmation that we sent actual JSX code down to the browser and the JSXTransformer component processed it like magic.

[Next » Pre-processing Client JSX on the Server](14-jsx-server)
