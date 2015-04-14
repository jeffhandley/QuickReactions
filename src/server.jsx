var React = require('react')
  , HelloWorld = require('./Components/HelloWorld')
  , express = require('express')
  , path = require('path')

var app = express()
app.use('/pages', express.static(path.join(__dirname, 'Pages')))

app.get('/', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    var html = React.renderToString(
                <html>
                    <head>
                        <title>Hello World</title>
                    </head>
                    <body>
                        <HelloWorld from="server.jsx, running on the server"></HelloWorld>
                        <div id="reactContainer" />
                        <div id="reactHelloContainer"></div>
                    </body>
                    <script src="/pages/index.js"></script>
                </html>)

        res.end(html)
})

app.listen(1337)
console.log('Server running at http://localhost:1337/')
