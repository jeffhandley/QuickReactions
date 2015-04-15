---
layout: default
title: Use React's JSX Syntax
step: 2
---
1. npm install react -save
1. Rename `index.js` to `index.jsx`

Update `index.jsx` to the following:

``` jsx
var http = require('http')
var React = require('react')

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(
        React.renderToString(
            <html>
                <head>
                    <title>Hello World</title>
                </head>
                <body>index.jsx compiled into index.js by hand on the server</body>
            </html>
        )
    )
}).listen(1337)
console.log('Server running at http://localhost:1337/')
```

## Get the react-tools installed
This will allow us to use React's JSX syntax and compile it to raw JS

1. npm install --global react-tools
1. npm install --save-dev react-tools

## Compile the JSX manually
Now if you run `jsx index.jsx > index.js` the JSX file will be compiled into raw JavaScript.  The output will match the following.

``` js
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
            React.createElement("body", null, "index.jsx compiled into index.js by hand on the server")
        ))
    )
}).listen(1337)
console.log('Server running at http://localhost:1337/')
```

You can now run `node index.js` and verify that the server still responds, now with "index.jsx compiled into index.js".  There's one more detail hidden under the covers here though; React has marked up the HTML with React data attributes that will allow React in the browser to understand the components that were rendered on the server.

If you view source in the browser, you'll see something like the following.

``` html
<html data-reactid=".qa6th1tqf4" data-react-checksum="-1942403816">
    <head data-reactid=".qa6th1tqf4.0">
        <title data-reactid=".qa6th1tqf4.0.0">Hello World</title>
    </head>
    <body data-reactid=".qa6th1tqf4.1">index.jsx compiled into index.js by hand on the server</body>
</html>
```

[Next » Use Gulp to improve the development workflow](3-gulp-workflow)