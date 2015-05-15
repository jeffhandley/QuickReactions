---
layout: default
title: React's Client-Side State
step: 10
---
One of the primary value propositions of React is that it reacts to state changes and automatically and efficiently re-renders components when state changes.  Let's take advantage of that!

Something that threw me off at first was just *where* I'd find the `setState` method.  Here were the options:

1. On `Timestamp`, which is the result of `React.createClass()`
1. On the result of `React.createFactory(Timestamp)`
1. On `timestampInstance`, which is the result of `React.createFactory(Timestamp)()`
1. On the result of `React.render(timestampInstance, document.getElementById("reactContainer"))`

I tried them in that order and of course the correct answer was the last option.  But that makes sense--it is the *rendered* component that has state to be updated.  So now that we know what object we'll be able to call `setState` on, let's use some state in `Timestamp.js`.

<pre class="brush: js">
var Timestamp = React.createClass({
    getInitialState: function() {
        return { date: "Initial State: " + new Date().toString() }
    },
    render: function() {
        return React.createElement("div", null, this.state.date)
    }
})
</pre>

Our component now sets its initial state to show the date but include a message that it's the initial state.  If you reload the page right now, you'll see that the "Initial State" message is shown and even though we're calling `render` every 1/2 second, the timestamp never changes.  That's because we're rendering the component but we're never updating its state from the initial state.  To update the state and trigger automatic rendering, we'll change `index.jsx`.

<pre class="brush: js">
var http = require('http')
  , React = require('react')
  , HelloWorld = require('./Components/HelloWorld')
  , fs = require('fs')

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    var body = React.renderToString(
                ^lt;body&gt;
                    ^lt;HelloWorld from="index.jsx on the server"&gt;^lt;/HelloWorld&gt;
                    ^lt;div id="reactContainer" /&gt;
                ^lt;/body&gt;)

        res.end('^lt;html&gt;^lt;head&gt;^lt;title&gt;Hello World^lt;/title&gt;^lt;script src="//fb.me/react-0.13.1.js"&gt;^lt;/script&gt;' +
                '^lt;/head&gt;' +
                '^lt;script&gt;' +
                fs.readFileSync('./Components/Timestamp.js') +
                '^lt;/script&gt;' +
                body +
                '^lt;script&gt;' +
                'var timestampInstance = React.createFactory(Timestamp)();' +
                'var timestampElement = React.render(timestampInstance, document.getElementById("reactContainer"));' +
                'setInterval(function() { timestampElement.setState({ date: "Updated through setState: " + new Date().toString() }) }, 500)' +
                '^lt;/script&gt;' +
                '^lt;/html&gt;'
        )

}).listen(1337)
console.log('Server running at http://localhost:1337/')
</pre>

Running the page now, you'll see the "Initial State" message for a 1/2 second and then it will change to "Updated through setState" and the timestamp will continue updating.  We are now updating the client-side component's state and React is automatically re-rendering the component for us.  **Yay!**

[Next » Introducing Some Routing](11-routing)
