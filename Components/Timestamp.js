var Timestamp = React.createClass({
    render: function() {
        return React.createElement("div", null, this.props.date)
    }
})

setInterval(function() {
    React.render(
        Timestamp({ date: new Date() }),
        document.getElementById('reactContainer')),
    500)
})