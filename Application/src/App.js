import React, { Component } from "react";

// REDUX //
import { connect } from "react-redux";

// CSS //
import "./assets/css/styles.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount(){
    document.title=process.env.TITLE;
  }

  render() {
    return (
        <div>
            
        </div>
    )
  }
}

const mapStateToProps = state => {
  return {
  };
};

const mapDispatchToProps = dispatch => {
  return {
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(App);