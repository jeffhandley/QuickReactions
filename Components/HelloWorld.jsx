var React = require('react')

module.exports = React.createClass({
    getInitialState: function() {
        return { from: this.props.from }
    },
    render: function() {
        return (
            <div>
                <div>
                    This is from the HelloWorld.jsx component's render function.
                </div>
                <div>
                    Rendered from: {this.state.from}
                </div>
            </div>
        )
    }
})
