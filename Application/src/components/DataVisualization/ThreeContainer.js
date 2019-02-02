import React, { Component } from 'react';

import threeEntryPoint from './ThreeEntryPoint';

class ThreeContainer extends Component {
    componentDidMount() {
        threeEntryPoint(this.threeRootElement);
    }

    render () {
        return (
            <div className="header-header" ref={element => this.threeRootElement = element} />
        );
    }
}

export default ThreeContainer;