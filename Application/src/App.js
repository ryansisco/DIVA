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
    max: 8,
    min: 2
  },
  zColumn: {
    name: 'Times',
    type: 'timestamp',
    max: 5,
    min: 0
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
    x: 10,
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
			xaxis: null,
			yaxis: null,
			zaxis: null,
			options: []
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
				<button className="notreadybutton">Filter</button><br/>
				<button className = "notreadybutton">Render</button><br/>
				<button className="notreadybutton">Download</button><br/>
				</div>
			)
		}
		if ((this.state.xaxis == null)||(this.state.yaxis == null)||(this.state.zaxis == null)) {
			return (
				<div>
				<button className="notreadybutton">Filter</button><br/>
				<button className = "notreadybutton">Render</button><br/>
				<button className="notreadybutton">Download</button><br/>
				</div>
			)
		}
		else {
			return (
				<div>
				<button className="button">Filter</button><br/>
				<button className = "button">Render</button><br/>
				<button className="button">Download</button><br/>
				</div>
			)
		}
	}

	onChangeFile = (event) =>{
		event.stopPropagation();
		event.preventDefault();
		var file = event.target.files[0];

		var reader = new FileReader();
		reader.onload = (event) => {
			this.setState({
				...this.state,
				options: uiToCSV_titles(event.target.result)
			});
		};
		reader.readAsText(file);
	}

	fileDialogue(){
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

	render() {
		const buttonText = this.state.checked ? '-' : '+';
		return (
				<div>
				<div className="topbox">
				 <center><div className="boxaroundlogo">
				 <img src={logo} className="mainlogo" width = '100px' height = 'auto'/><br/>
				 </div></center></div>
				 <button className='menubutton' onClick={() => this.setState({checked:!this.state.checked})}>{buttonText}</button><br/>
         {this.toggleMenu()}
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
