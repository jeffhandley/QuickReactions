var http = require('http')
  , React = require('react')
  , HelloWorld = require('./Components/HelloWorld')

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
                'var Timestamp = React.createClass({ render: function() { return React.createElement("div", null, "Client-Side React") }});' +
                'React.renderComponentToString(Timestamp(), document.getElementById("reactContainer"))' +
                '</script>' +
                body +
                '</html>'
        )

}).listen(1337)
console.log('Server running at http://localhost:1337/')

/*

                '<script>' + 
                'var Timestamp = React.createClass({ render: function() { return React.createElement("div", null, this.props.date) } })' + 
                'setInterval(function() { React.render(Timestamp({ date: new Date() }), document.getElementById("reactContainer")), 500) })' + 
                '</script>' +

*/