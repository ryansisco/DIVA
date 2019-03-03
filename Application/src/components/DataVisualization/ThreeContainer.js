import React, { Component } from 'react';
import { connect } from 'react-redux';

import threeEntryPoint from './ThreeEntryPoint';

class ThreeContainer extends Component {
    componentDidUpdate(prevProps) {
        if (this.props.graphData.type === 'GRAPH_UPDATE') {
            threeEntryPoint(this.threeRootElement, this.props.graphData.data)
        }
    }

    render () {
        return (
            <div ref={element => this.threeRootElement = element} ></div>
        );
    }
}


const mapStateToProps = state => {
    return {
        graphData: state.graphData
    };
  };

export default connect(mapStateToProps)(ThreeContainer);
