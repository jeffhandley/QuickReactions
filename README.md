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

### Get the react-tools installed
This will allow us to use React's JSX syntax and compile it to raw JS

1. npm install react-tools -save-dev
1. npm uninstall react-tools
1. npm install react-tools -g

## References

Here are some of the other samples and posts I referenced along the way.

1. The example webserver at [https://nodejs.org/](https://nodejs.org/)
1. [http://facebook.github.io/react/docs/getting-started.html](http://facebook.github.io/react/docs/getting-started.html)

