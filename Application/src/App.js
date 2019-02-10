import React, { Component } from "react";

// REDUX //
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateCameraPosition } from './redux/actions';

// CSS //
import "./assets/css/styles.css";

import ThreeContainer from './components/DataVisualization/ThreeContainer';

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
        <ThreeContainer />
        <input type='text'/>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  updateCameraPosition
}, dispatch);

export default connect(mapStateToProps,mapDispatchToProps)(App);