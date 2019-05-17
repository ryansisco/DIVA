import React, { Component } from 'react';
import { connect } from 'react-redux';

import threeEntryPoint from './ThreeEntryPoint';

class ThreeContainer extends Component {
    componentDidUpdate() {
        if (this.props.graphData.type === 'GRAPH_UPDATE' || this.props.graphicOptions.data === 'GRAPHIC_OPTIONS_UPDATE') {
            threeEntryPoint(this.threeRootElement, this.props.graphData.data, this.props.graphicOptions.data)
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
        graphData: state.graphData,
        graphicOptions: state.graphicOptions
    };
  };

export default connect(mapStateToProps)(ThreeContainer);
