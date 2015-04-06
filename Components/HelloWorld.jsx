var React = require('react')

module.exports = React.createClass({
    render: function() {
        return (
            <div>
                <div>
                    This is from the HelloWorld.jsx component's render function.
                </div>
                <div>
                    Rendered from: {this.props.from}
                </div>
            </div>
        )
    }
})
