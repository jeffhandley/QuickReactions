---
layout: default
title: Aiming for Isomorphic
step: 15
---
The last step for this project is to get our page into the "Isomorphic" functionality, where we render the page from the server but then let the client take over the server-rendered React components and update their state to re-render them.  We have two components to use for this stage: HelloWorld and Timestamp.  Let's start with HelloWorld.

It's been a while since we've looked at HelloWorld, let's refresh our memories of what that component looks like.

<pre class="brush: js">
var React = require('react')

module.exports = React.createClass({
    render: function() {
        return (
            &lt;div&gt;
                &lt;div&gt;
                    This is from the HelloWorld.jsx component's render function.
                &lt;/div&gt;
                &lt;div&gt;
                    Rendered from: {this.props.from}
                &lt;/div&gt;
            &lt;/div&gt;
        )
    }
})
</pre>

Okay, cool - this component already has a placeholder for where it was rendered from.  But it's based on props, not state.  Let's convert it over to use state so that the client can more easily update it.

<pre class="brush: js">
var React = require('react')

module.exports = React.createClass({
    getInitialState: function() {
        return { from: this.props.from }
    },
    render: function() {
        return (
            &lt;div&gt;
                &lt;div&gt;
                    This is from the HelloWorld.jsx component's render function.
                &lt;/div&gt;
                &lt;div&gt;
                    Rendered from: {this.state.from}
                &lt;/div&gt;
            &lt;/div&gt;
        )
    }
})
</pre>

We now pass the property in the same way, but the property value gets converted over to state, which we can then modify later through `setState()`.  Now let's see what happens when we try to use this component on the client.  We'll simply add another `&lt;script&gt;` tag to get started.

`&lt;script src="/Components/HelloWorld.js"&gt;&lt;/script&gt;`

Running the page, we get an error in the console.

`Uncaught ReferenceError: require is not defined`

Dang.  HelloWorld.js is using Node's `require` and `module.exports` to register itself as a module.  We skipped that in Timestamp.js, which is why it worked; the browser doesn't support these constructs.

[Next » Using Browserify](16-browserify)
