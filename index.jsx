var http = require('http')
  , React = require('react')
  , HelloWorld = require('./Components/HelloWorld')
  , fs = require('fs')

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    var body = React.renderToString(
                <body>
                    <HelloWorld from="index.jsx on the server"></HelloWorld>
                    <div id="reactContainer" />
                </body>)

        res.end('<html><head><title>Hello World</title><script src="//fb.me/react-0.13.1.js"></script>' + 
                '</head>' +
                '<script>' +
                fs.readFileSync('./Components/Timestamp.js') +
                '</script>' +
                body +
                '<script>' +
                'var timestampInstance = React.createFactory(Timestamp)();' +
                'var timestampElement = React.render(timestampInstance, document.getElementById("reactContainer"));' +
                'setInterval(function() { timestampElement.setState({ date: "Updated through setState: " + new Date().toString() }) }, 500)' +
                '</script>' +
                '</html>'
        )

}).listen(1337)
console.log('Server running at http://localhost:1337/')
