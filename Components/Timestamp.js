var Timestamp = React.createClass({
    getInitialState: function() {
        return { date: "Initial State: " + new Date().toString() }
    },
    render: function() {
        return React.createElement("div", null, this.state.date)
    }
})
