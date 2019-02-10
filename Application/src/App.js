import React, { Component } from "react";
// REDUX //
import { connect } from "react-redux";
import Dropdown from 'react-dropdown';
import FileDialogue from './components/FileSelector';
import Draggable from 'react-draggable';
// CSS //
import "./assets/css/styles.css";

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

  Renderready(){
    if ((this.state.xaxis == this.state.yaxis)||(this.state.yaxis == this.state.zaxis)||(this.state.xaxis == this.state.zaxis)) {
      return (
        <div>
        <button className = "notreadybutton">Render</button>
        <button className="button">Filter</button>
        </div>
      )
    }
    if ((this.state.xaxis == null)||(this.state.yaxis == null)||(this.state.zaxis == null)) {
      return (
        <div>
        <button className = "notreadybutton">Render</button>
        <button className="button">Filter</button>
        </div>
      )
    }
    else {
      return (
        <div>
        <button className = "button">Render</button>
        <button className="button">Filter</button>
        </div>
      )
    }
  }

  Togglemenu(){
    const defaultOption = this.state.selected;
    const placeHolderValue = typeof this.state.selected === 'string' ? this.state.selected : this.state.selected.label;
    if (this.state.checked==1) {
        return (
          <Draggable>
          <div className = "menucontainer">
             <button className = "button"><FileDialogue/></button>
             <button className="button">Output</button><br/><br/>
             <form className ="dropdownmenu">
             <Dropdown options={options} onChange={e => this._onSelect('xaxis', e)} value={this.state.xaxis} placeholder="X-Axis" /><br/><br/>
             <Dropdown options={options} onChange={e => this._onSelect('yaxis', e)} value={this.state.yaxis} placeholder="Y-Axis" /><br/><br/>
             <Dropdown options={options} onChange={e => this._onSelect('zaxis', e)} value={this.state.zaxis} placeholder="Z-Axis" /><br/>
             </form>
             {this.Renderready()}
          </div>
          </Draggable>
        );
    }
    if (this.state.checked==0) {
      return (
        <div></div>
        );
    }
  }

  render() {
    const buttonText = this.state.checked ? '-' : '+';
    return (
        <div>
         <button className='menubutton' onClick={() => this.setState({checked:!this.state.checked})}>{buttonText}</button><br/>
         {this.Togglemenu()}
         <center><img src={logo} className="mainlogo" width = "40%" height = 'auto'/></center><br/>
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
