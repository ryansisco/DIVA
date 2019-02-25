import React, { Component } from 'react';

class Button extends Component {
    render() {
        return (
            <button onClick={this.props.incrementValue}>Click me</button>
        );
    }
}

export default Button;