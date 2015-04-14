var React = require('react')
var HelloWorld = require('../Components/HelloWorld')
var Timestamp = require('../Components/Timestamp')

React.render(
    <HelloWorld from='index.jsx, transformed, bundled, and running on the client' />,
    document.getElementById('reactHelloContainer'))

var timestampElement = React.render(
    <Timestamp />,
    document.getElementById('reactContainer'))

setInterval(function() {
    timestampElement.setState({ date: "Updated through setState: " + new Date().toString() }) },
    500)
