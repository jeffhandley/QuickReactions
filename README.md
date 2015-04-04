# Quick Reactions - Isomorphic Hello World with React and Node

While trying to learn Node.js and React.js, I was hoping to find a skeleton Hello World sample that demonstrated both server-side and client-side use of React, but I couldn't find one.  This project aims to achieve the bare minimum functionality while exercising the isomorphic approach.

## Starting from Scratch
While following through sample after sample for Node and React, I found that they kept following a pattern that wasn't very helpful. Instead of truly starting from scratch, the samples I found kept walking through step-by-step of cloning a working solution--Step 1: paste in this complex file--Step 2: paste in this other complex file.  I wanted to learn by starting truly from scratch and building the app up in logical, incremental steps.

### Create a new "project"
1. CD into a new directory
1. git init
1. npm init

### Get Node to emit Hello World with hard-coded HTML
Create `index.js` using the example webserver code from [https://nodejs.org](https://nodejs.org/).

``` js
var http = require('http')
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end('<html><head><title>Hello World</title></head><body>index.js on the server</body></html>')
}).listen(1337)
console.log('Server running at http://localhost:1337/')
```

### Using the JSX Syntax
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
        </html>)
    )
}).listen(1337)
console.log('Server running at http://localhost:1337/')
```

### Get the react-tools installed
This will allow us to use React's JSX syntax and compile it to raw JS

1. npm install react-tools -save-dev
1. npm uninstall react-tools
1. npm install react-tools -g

### Compile the JSX manually
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

## References

Here are some of the other samples and posts I referenced along the way.

1. The example webserver at [https://nodejs.org/](https://nodejs.org/)
1. [http://facebook.github.io/react/docs/getting-started.html](http://facebook.github.io/react/docs/getting-started.html)
1. [http://facebook.github.io/react/docs/jsx-in-depth.html](http://facebook.github.io/react/docs/jsx-in-depth.html)
1. [http://www.crmarsh.com/react-ssr/](http://www.crmarsh.com/react-ssr/)