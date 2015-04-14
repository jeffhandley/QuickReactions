var React = require('react')
  , HelloWorld = require('./Components/HelloWorld')
  , express = require('express')
  , path = require('path')

var app = express()
app.use('/Components', express.static(path.join(__dirname, 'Components')))
app.use('/assets', express.static(path.join(__dirname, 'assets')))

app.get('/', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    var html = React.renderToString(
                <html>
                    <head>
                        <title>Hello World</title>
                    </head>
                    <body>
                        <HelloWorld from="index.jsx on the server"></HelloWorld>
                        <div id="reactContainer" />
                        <div id="reactHelloContainer"></div>
                    </body>
                    <script src="/assets/index.js"></script>
                </html>)

        res.end(html)
})

app.listen(1337)
console.log('Server running at http://localhost:1337/')
