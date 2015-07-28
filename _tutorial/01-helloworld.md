---
layout: default
title: Hello World in Node.js
step: 1
---
For this step, you first need to follow the instructions found at [nodejs.org](https://nodejs.org) to get Node working on your machine.  After that, there's not much to do for getting Hello World working.

## Create a new "project"
1. CD into a new directory
1. `git init`
1. `npm init`

## Get Node to emit Hello World with hard-coded HTML
Create `index.js` using the example webserver code from [https://nodejs.org](https://nodejs.org/).

<pre class="brush: js">
    var http = require('http')
    http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end('<html><head><title>Hello World</title></head><body>index.js on the server</body></html>')
    }).listen(1337)
    console.log('Server running at http://localhost:1337/')
</pre>

[Next » Using React's JSX Syntax](02-jsx.html)
