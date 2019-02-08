import React, { Component } from "react";
// REDUX //
import { connect } from "react-redux";
// CSS //
import "./assets/css/styles.css";
import logo from './assets/img/logo.png';

import FileDialogue from './components/FileSelector';

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
          <FileDialogue/>
         <img src={logo} width="50%" height="50%"/><br/>

         <button type="button">Options</button><br/><br/>
         <button type="button">Output</button><br/><br/>
         <form>
         X-Axis: <input type="text" name="xaxis1"/>
         <input type="text" name="xaxis2"/><br/>
         Y-Axis: <input type="text" name="yaxis1"/>
         <input type="text" name="yaxis2"/><br/>
         Z-Axis: <input type="text" name="zaxis1"/>
         <input type="text" name="zaxis2"/>
         </form>
         <button type="button">Render</button>
         <button type="button">Filter</button>
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
