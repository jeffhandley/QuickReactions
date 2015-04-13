var Timestamp = React.createClass({
    getInitialState: function() {
        return { date: "Initial State: " + new Date().toString() }
    },
    render: function() {
        return <div>{this.state.date}</div>
    }
})
