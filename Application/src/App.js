import React, { Component } from "react";
// REDUX //
import { connect } from "react-redux";
import Popup from 'react-popup';
import Dropdown from 'react-dropdown';
import Draggable from 'react-draggable';
// CSS //
import "./assets/css/styles.css";

// FILES //
import logo from './assets/img/logo.png';

var options = [];
//   'IOC', 'Date', 'Country', 'IOC Type', 'Sector'
// ]

//////////////////////////////////////////////////////////////
//////// CSV PARSER JAVASCRIPT FUNCTIONS - BEGIN /////////////
//////////////////////////////////////////////////////////////

const userSelect = [
'IOC', 'Date', 'Country Code'
];

//Return the first line of the CSV file as an array
//INPUT: contents of entire CSV file
//OUTPUT: div = ['row1_col1', 'row1_col2', ..., 'row1_colN']
function uiToCSV_object1(content){
  var str = content;
  var first = str.split('\n')[0];
  var div = first.split(',');
  return div;
};

//
function uiToCSV_object2(content){
  var object = [];

  return object;
};

function uiToCSV_object3(content){
  var object = [];

  return object;
};

//Returns first object for CSV --> 3DV
//USES GLOBAL: userSelect
function parserTo3DV_object1(){

  var select1 = userSelect[0], 
      select2 = userSelect[1],
      select3 = userSelect[2];

  var type1 = "string", 
      type2 = "timestamp",
      type3 = "string";

  var text = '{"xColumn":{"title":"'+select1+'","type":"'+type1+'"},"yColumn":{"title":"'+select2+'","type":"'+type2+'"},"zColumn":{"title":"'+select3+'","type":"'+type3+'"}}';
  var object = JSON.parse(text);

  return object;
};

//Returns second object for CSV --> 3DV
//USES GLOBAL: userSelect
function parserTo3DV_object2(content){
  var object = [];
  var text = '[';
  var contentArray = content.split('\n');
  var contentArrayLength = contentArray.length;

  var xTemp, xOffset = contentArray[0].split(',').indexOf(userSelect[0]);
  var yTemp, yOffset = contentArray[0].split(',').indexOf(userSelect[1]);
  var zTemp, zOffset = contentArray[0].split(',').indexOf(userSelect[2]);
  var textTemp = "";

  for (var i = 1; i < contentArrayLength; i++){
    var subdataTemp = {};
    var rowArray = contentArray[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    var rowArrayLength = rowArray.length;

    if(rowArray[0][0] == '"'){
      //rowArray[0][0] = '_';
    }
    xTemp = rowArray[xOffset], yTemp = rowArray[yOffset], zTemp = rowArray[zOffset];
    textTemp += '{"x":"'+xTemp+'","y":"'+yTemp+'","z":"'+zTemp+'"}';

    //TODO: subdata

    if(i != (contentArrayLength - 1)){
      textTemp += ",";
    }
  }
  
  text = text + textTemp + "]";
  //console.log(text);
  
  //object = JSON.parse(text);

  return text;
};

//////////////////////////////////////////////////////////////
////////// CSV PARSER JAVASCRIPT FUNCTIONS - END /////////////
//////////////////////////////////////////////////////////////

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
        <button className="notreadybutton">Filter</button>
        </div>
      )
    }
    if ((this.state.xaxis == null)||(this.state.yaxis == null)||(this.state.zaxis == null)) {
      return (
        <div>
        <button className = "notreadybutton">Render</button>
        <button className="notreadybutton">Filter</button>
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
  onChangeFile(event) {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    this.setState({file});

    var reader = new FileReader();
    reader.onload = function(event){
      var contents = event.target.result;
      options = uiToCSV_object1(contents);
      console.log(parserTo3DV_object2(contents));
    };
    reader.readAsText(file);

    console.log(file.name);
  }
  FileDialogue(){
    return (
    <div>
      <input 
        className="fileinput"
        type="file"
        ref={(ref) => this.upload = ref}
        onChange={this.onChangeFile.bind(this)}
      />
      <button 
        className = "button"
        onClick={()=>{this.upload.click()}}
      >Upload File</button>
      <button className="button">Download</button><br/><br/>
    </div>
    )
  }
  Togglemenu(){
    const defaultOption = this.state.selected;
    const placeHolderValue = typeof this.state.selected === 'string' ? this.state.selected : this.state.selected.label;

    if (this.state.checked==1) {
        return (
          <Draggable>
          <div className = "menucontainer">
             {this.FileDialogue()}
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
