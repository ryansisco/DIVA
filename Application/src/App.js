import React, { Component } from "react";

// REDUX //
import { connect } from "react-redux";
import Dropdown from 'react-dropdown';


// CSS //
import "./assets/css/styles.css";
import 'react-dropdown/style.css';

// FILES //
import logo from './assets/img/logo.png';

const options = [
  'IOC', 'Date', 'Country', 'IOC Type', 'Sector'
]

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: false,
      selected: '',
      xaxis: null,
      yaxis: null,
      zaxis: null
    };
    this._onSelect = this._onSelect.bind(this);
  }
  _onSelect (option, e) {
    this.setState({
      ...this.state,
      [option]: e.value
    })
  }

  componentDidMount(){
    document.title=process.env.TITLE;
  }

  Togglemenu(){
    const defaultOption = this.state.selected;
    const placeHolderValue = typeof this.state.selected === 'string' ? this.state.selected : this.state.selected.label;
    if (this.state.checked==1) {
        return (
          <div>
            <br/><br/>
            <button type="subbutton">Input</button>
             <button type="subbutton">Output</button><br/><br/>
             <form>
             X-Axis: <Dropdown options={options} onChange={e => this._onSelect('xaxis', e)} value={this.state.xaxis} placeholder="Select X-Axis" /><br/>
             Y-Axis: <Dropdown options={options} onChange={e => this._onSelect('yaxis', e)} value={this.state.yaxis} placeholder="Select Y-Axis" /><br/>
             Z-Axis: <Dropdown options={options} onChange={e => this._onSelect('zaxis', e)} value={this.state.zaxis} placeholder="Select Z-Axis" /><br/>
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
