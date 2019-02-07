import React, { Component } from "react";

// REDUX //
import { connect } from "react-redux";

import Toggle from "react-toggle-component";

// CSS //
import "./assets/css/styles.css";
import "react-toggle-component/styles.css";

// FILES //
import logo from './assets/img/logo.png';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: false
    };
  }

  componentDidMount(){
    document.title=process.env.TITLE;
  }

  Togglemenu(){
    if (this.state.checked==1) {
        return (
          <div>
            <br/><br/>
            <button type="subbutton">Input</button>
             <button type="subbutton">Output</button><br/><br/>
             <form>
             X-Axis: <input type="text" name="xaxis1"/>
             <input type="text" name="xaxis2"/><br/>
             Y-Axis: <input type="text" name="yaxis1"/>
             <input type="text" name="yaxis2"/><br/>
             Z-Axis: <input type="text" name="zaxis1"/>
             <input type="text" name="zaxis2"/>
             </form>
             <button type="subbutton">Render</button>
             <button type="subbutton">Filter</button>
          </div>
        );
    }
    if (this.state.checked==0) {
      return (
        <div></div>
        );
    }
  }

  render() {
    const buttonText = this.state.checked ? 'Hide Menu' : 'Show Menu';
    return (
        <div>
         <img src={logo} width = "25%" height = 'auto'/><br/>
         <button onClick={() => this.setState({checked:!this.state.checked})}>{buttonText}</button><br/>
         {this.Togglemenu()}
        </div>
    );
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
