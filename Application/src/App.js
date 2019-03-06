import React, { Component } from "react";
// REDUX //
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateGraphData } from './redux/actions';

// Components //
import Dropdown from 'react-dropdown';
import { uiToCSV_titles, uiToCSV_object2, uiToCSV_object3, parserTo3DV_object } from "./assets/js/csvParser.js";
import ThreeContainer from './components/DataVisualization/ThreeContainer';

// CSS //
import "./assets/css/styles.css";

// FILES //
import logo from './assets/img/logo.png';
import hamburger from './assets/img/hamburger.png';
import helpimg from './assets/img/helpimg.png';
import camera from './assets/img/camera.png'
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
			value: false,
			selected: '',
      selected2: '',
      selected3: '',
			xaxis: null,
			yaxis: null,
			zaxis: null,
			options: [],
			csvfilename: null
		};
		this.onSelect = this.onSelect.bind(this);
	}

  onSelect (option, e) {
		this.setState({
			...this.state,
			[option]: e.value
		})
	}

	componentDidMount() {
    this.props.updateGraphData({...dummyAxes, data: graphData})
		document.title=process.env.TITLE;
	}

	renderReady(){
		if ((this.state.xaxis == this.state.yaxis)||(this.state.yaxis == this.state.zaxis)||(this.state.xaxis == this.state.zaxis)) {
			return (
				<div>
				<button className = "notreadybutton">Filter</button><br/>
				<button className = "notreadybutton">Render</button><br/>
				<button className = "notreadybutton">Download</button><br/>
				</div>
			)
		}
		if ((this.state.xaxis == null)||(this.state.yaxis == null)||(this.state.zaxis == null)) {
			return (
				<div>
				<button className = "notreadybutton">Filter</button><br/>
				<button className = "notreadybutton">Render</button><br/>
				<button className = "notreadybutton">Download</button><br/>
				</div>
			)
		}
		else {
			return (
				<div>
				<button className = "button">Filter</button><br/>
				<button className = "button">Render</button><br/>
				<button className = "button">Download</button><br/>
				</div>
			)
		}
	}

	onChangeFile = (event) =>{
		event.stopPropagation();
		event.preventDefault();
		var file = event.target.files[0];
		if (file.type == "application/vnd.ms-excel") {
		var reader = new FileReader();
		reader.onload = (event) => {
			this.setState({
				...this.state,
				options: uiToCSV_titles(event.target.result),
				csvfilename: file.name
			});
		};
		reader.readAsText(file);
		}
		else {
			alert("File must be type CSV");
		}
	}

	fileDialogue(){
		return (
		<div>
			<input
				className = "fileinput"
				type = "file"
				ref = {(ref) => this.upload = ref}
				onChange = {this.onChangeFile.bind(this)}
			/>
			<button
				className = "button"
				onClick = {() => {this.upload.click()}}
			>Upload File</button>
		</div>
		)
	}

	toggleMenu(){
		const defaultOption = this.state.selected;
		const placeHolderValue = typeof this.state.selected === 'string' ? this.state.selected : this.state.selected.label;
		if (this.state.checked==1) {
				return (
					<div className = "menucontainer">
						 {this.fileDialogue()}
						 <div className = "selectedfile">Uploaded File: <a className = "filename"> {this.state.csvfilename}</a></div>
						 <form className ="dropdownmenu">
						 X-Axis:<Dropdown options={this.state.options} onChange={e => this.onSelect('xaxis', e)} value={this.state.xaxis} placeholder="..." /><br/>
						 Y-Axis:<Dropdown options={this.state.options} onChange={e => this.onSelect('yaxis', e)} value={this.state.yaxis} placeholder="..." /><br/>
						 Z-Axis:<Dropdown options={this.state.options} onChange={e => this.onSelect('zaxis', e)} value={this.state.zaxis} placeholder="..." />
						 </form>
						 {this.renderReady()}
					</div>
				);
		}
		if (this.state.checked==0) {
			return (
				<div></div>
				);
		}
	}

  toggleHelpMenu(){
    const defaultOption = this.state.selected2;
    const placeHolderValue = typeof this.state.selected2 === 'string' ? this.state.selected2 : this.state.selected2.label;
    if (this.state.checked2==1) {
        return (
          <div className = "helpmenucontainer">
             <form className ="dropdownhelpmenu">
             This is a 3D visulization application called DIVA.<br/>
             It lets the user upload a CSV file to visualize the<br/>
             3D visualization of the data objects in the file.<br/> <br/>
             To use this web application use the following steps:<br/>
             1.Click on this button <img src={hamburger} className="hamburgerimg2" height = 'auto' width = '12px'/> which is on the top left most <br/>
             side of the menu. This will pop up a window <br/>
             with different options.<br/> <br/>
             2. By pressing the Upload file button you can upload <br/>
             a CSV file, after which it is uploaded the user can  <br/>
             see the file name right beneath it.<br/><br/>
             3.The user then select the data variables for X axis,<br/>
             Y axis and Z axis repectively.<br/><br/>
             4.By clicking on the render button after that the user <br/>
             can visualize a 3D interactive visualixation, which can <br/>
             then be filtered using the filter button or dowloaded <br/>
             using the dowload button.
             </form>
          </div>
        );
    }
    if (this.state.checked2==0) {
      return (
        <div></div>
        );
    }
  }

  toggleCamera(){
    const defaultOption = this.state.selected3;
    const placeHolderValue = typeof this.state.selected3 === 'string' ? this.state.selected3 : this.state.selected3.label;
    if (this.state.checked3==1) {
        return (
          <div className = "helpmenucontainer">
             <form className ="dropdowncamera">
             jjjjjjjjjjjjjjjjjjjjjjjjjjj
             </form>
          </div>
        );
    }
    if (this.state.checked3==0) {
      return (
        <div></div>
        );
    }
  }


	render() {
		return (
			<div>
				<div className="topbox">
				<center><div className="boxaroundlogo">
				<img src={logo} className="mainlogo" height = 'auto' width = '110px'/><br/>
				</div></center></div>

            <button className='menubutton' onClick={() => this.setState({checked:!this.state.checked})}>
         		<img src={hamburger} className="hamburgerimg" width = '26px' height = 'auto'/>
         		</button><br/>
         		{this.toggleMenu()}

            <button className='helpmenubutton' onClick={() => this.setState({checked2:!this.state.checked2})}>
            <img src={helpimg} className="helpimg" width = '26px' height = 'auto'/>
            </button><br/>
            {this.toggleHelpMenu()}

            <button className='camerabutton' onClick={() => this.setState({checked3:!this.state.checked3})}>
            <img src={camera} className="camera" width = '26px' height = 'auto'/>
            </button><br/>
            {this.toggleCamera()}
            
         		<ThreeContainer />
    		</div>
		);
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
