var React = require('react')
var HelloWorld = require('../lib/Components/HelloWorld')
var Timestamp = require('../lib/Components/Timestamp')

var timestampInstance = React.createFactory(Timestamp)();
var timestampElement = React.render(timestampInstance, document.getElementById("reactContainer"));
setInterval(function() { timestampElement.setState({ date: "Updated through setState: " + new Date().toString() }) }, 500)

var helloInstance = React.createFactory(HelloWorld)( { from: "From the client" } );
var helloElement = React.render(helloInstance, document.getElementById("reactHelloContainer"));
