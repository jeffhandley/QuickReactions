var React = require('react')
var HelloWorld = require('../Components/HelloWorld')
var Timestamp = require('../Components/Timestamp')

var timestampInstance = React.createFactory(Timestamp)();
var timestampElement = React.render(timestampInstance, document.getElementById("reactContainer"));
setInterval(function() { timestampElement.setState({ date: "Updated through setState: " + new Date().toString() }) }, 500)

var helloInstance = React.createFactory(HelloWorld)( { from: "index.jsx, transformed and running on the client" } );
var helloElement = React.render(helloInstance, document.getElementById("reactHelloContainer"));
