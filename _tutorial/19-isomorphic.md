---
layout: default
title: Reaching Isomorphic Goal
step: 19
---
&gt; isomorphic
&gt;
&gt; ADJECTIVE
&gt; corresponding or similar in form and relations.

With React apps, people have been using the term 'isomorphic' to describe applications that:

1. Render pages and components on the server, routing requests to the right views
1. After page load, the browser creates the same components and takes over rendering and routing thereafter

React makes this approach really efficient because it puts checksums on DOM elements and when the client rendering is performed, any elements that have the same content as what the server generated will not be re-rendered in the DOM.

Getting to isomorphic behavior was the goal of this project; let's see if we can do it now.  We are already rendering the `&lt;HelloWorld&gt;` component on the server and separately on the client.  Instead of having two instances on the page, we'll combine them and achieve the isomorphic goal.

When the client calls `React.render()`, we need to give it the container element.  For our client-side rendering of HelloWorld, we were using the `&lt;div id="reactHelloContainer"&gt;` element.  Let's just move our server-side rendering of HelloWorld into that container, and then the client-side rendering should take it over.

<pre class="brush: js">
var React = require('react')
  , HelloWorld = require('./Components/HelloWorld')
  , express = require('express')
  , path = require('path')

var app = express()
app.use('/pages', express.static(path.join(__dirname, 'Pages')))

app.get('/', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    var html = React.renderToString(
                &lt;html&gt;
                    &lt;head&gt;
                        &lt;title&gt;Hello World&lt;/title&gt;
                    &lt;/head&gt;
                    &lt;body&gt;
                        &lt;div id="reactContainer" /&gt;
                        &lt;div id="reactHelloContainer"&gt;
                            &lt;HelloWorld from="server.jsx, running on the server"&gt;&lt;/HelloWorld&gt;
                        &lt;/div&gt;
                    &lt;/body&gt;
                    &lt;script src="/pages/index.js"&gt;&lt;/script&gt;
                &lt;/html&gt;)

        res.end(html)
})

app.listen(1337)
console.log('Server running at http://localhost:1337/')
</pre>

Running the page at this point, we'll see that we now have a single Timestamp element with a single HelloWorld component under that.  The Timestamp element refreshes every second and we can still see its initial flicker.  But for the HelloWorld component, we only see its client-side result without ever seeing the server's message.  So, did it work?

Well, the test for that is easy: **View Source**.

<pre class="brush: html">
&lt;html data-reactid=".1hcyssffzeo" data-react-checksum="1801386867"&gt;
    &lt;head data-reactid=".1hcyssffzeo.0"&gt;
        &lt;title data-reactid=".1hcyssffzeo.0.0"&gt;Hello World&lt;/title&gt;
    &lt;/head&gt;
    &lt;body data-reactid=".1hcyssffzeo.1"&gt;
        &lt;div id="reactContainer" data-reactid=".1hcyssffzeo.1.0"&gt;&lt;/div&gt;
        &lt;div id="reactHelloContainer" data-reactid=".1hcyssffzeo.1.1"&gt;
            &lt;div data-reactid=".1hcyssffzeo.1.1.0"&gt;
                &lt;div data-reactid=".1hcyssffzeo.1.1.0.0"&gt;This is from the HelloWorld.jsx component&#x27;s render function.&lt;/div&gt;
                &lt;div data-reactid=".1hcyssffzeo.1.1.0.1"&gt;
                    &lt;span data-reactid=".1hcyssffzeo.1.1.0.1.0"&gt;Rendered from: &lt;/span&gt;
                    &lt;span data-reactid=".1hcyssffzeo.1.1.0.1.1"&gt;server.jsx, running on the server&lt;/span&gt;
                &lt;/div&gt;
            &lt;/div&gt;
        &lt;/div&gt;
    &lt;/body&gt;
    &lt;script src="/pages/index.js" data-reactid=".1hcyssffzeo.2"&gt;&lt;/script&gt;
&lt;/html&gt;
</pre>

We can see that the HelloWorld component clearly contained the "server.jsx, running on the server" message.  But then when the `/pages/index.js` script ran, the component was re-rendered with the result of the client component.  Sweet!

*This is now an isomorphic app!*

For one last illustration to see that this is working, you can disable JavaScript (Chrome's developer tools has a handy checkbox for that), refresh the page, and see only the server-rendered HelloWorld message.  The Timestamp won't render and the HelloWorld message won't change to the client's message.

[References](20-references)
