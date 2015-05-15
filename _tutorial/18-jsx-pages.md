---
layout: default
title: Rendering Pages with JSX
step: 18
---
With this restructuring in place, and with Browserify building `/src/Pages/index.jsx`, it seems natural to use JSX for that file too.  Looking at `gulpfile.js` again, we can see that file is going through the following stages:

1. Source file at `/src/Pages/index.jsx`
1. The 'jsx' task transforms it and writes the output to `/bin/Pages/index.js`
1. The 'client-scripts' task runs Browserify on `/bin/Pages/index.js` and overwrites that file with the output

For clear illustration of this, we can temporarily update `gulpfile.js` so that the output of the 'client-scripts' task goes to `/bin/Pages/bundles'.  We can then see that the intermediate output is written to `/bin/Pages/index.js' and the bundled output goes to `/bin/Pages/bundles/index.js`.  Now that we get that, we can revert the change though.

Since `/src/Pages/index.jsx` is going through the JSX transform though, let's go ahead and use JSX for it.

<pre class="brush: js">
var React = require('react')
var HelloWorld = require('../Components/HelloWorld')
var Timestamp = require('../Components/Timestamp')

React.render(
    &lt;HelloWorld from='index.jsx, transformed, bundled,
        and running on the client' /&gt;,
    document.getElementById('reactHelloContainer'))

var timestampElement = React.render(
    &lt;Timestamp /&gt;,
    document.getElementById('reactContainer'))

setInterval(function() {
    timestampElement.setState({
        date: "Updated through setState: "
              + new Date().toString() }) },
    500)
</pre>

Just to make sure this actually worked, the `<HelloWorld>` message was changed slightly. But yeah, this worked like a charm!

[Next » Going Isomorphic](19-isomorphic)
