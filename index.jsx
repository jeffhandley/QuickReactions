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
            <body>
                index.jsx, automatically processed through gulp and gulp-react,
                with node automatically restarted through gulp-nodemon!
            </body>
        </html>)
    )
}).listen(1337)
console.log('Server running at http://localhost:1337/')