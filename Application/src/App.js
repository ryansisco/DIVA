import React, { Component } from "react";

// REDUX //
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateGraphData } from './redux/actions';

// CSS //
import "./assets/css/styles.css";

// COMPONENTS //
import ThreeContainer from './components/DataVisualization/ThreeContainer';

const dummyAxes = {
  xColumn: {
    name: 'Country',
    type: 'string',
    max: 10,
    min: 0
  },
  yColumn: {
    name: 'IP',
    type: 'string',
    max: 10,
    min: 0
  },
  zColumn: {
    name: 'Times',
    type: 'timestamp',
    max: 10,
    min: 2
  }
}

const graphData = [
  {
    x: 2,
    y: 3,
    z: 0
  },
  {
    x: 5,
    y: 5,
    z: 5
  },
  {
    x: 0,
    y: 8,
    z: 3
  },
  {
    x: 6,
    y: 2,
    z: 3
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount(){
    document.title=process.env.TITLE;
  }

  render() {
    return (
      <div>
        <button onClick={() => this.props.updateGraphData({...dummyAxes, data: graphData})}>Click Me</button>
        <ThreeContainer />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  updateGraphData
}, dispatch);

export default connect(mapStateToProps,mapDispatchToProps)(App);