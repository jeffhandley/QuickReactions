var http = require('http')
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end('<html><head><title>Hello World</title></head><body>index.js on the server</body></html>')
}).listen(1337)
console.log('Server running at http://localhost:1337/')