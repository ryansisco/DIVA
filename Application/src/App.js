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

  toggleHelpMenu(){
    const defaultOption = this.state.selected2;
    const placeHolderValue = typeof this.state.selected2 === 'string' ? this.state.selected2 : this.state.selected2.label;
    if (this.state.checked2==1) {
        return (
          <div className = "helpmenucontainer">
             <form className ="dropdownhelpmenu">
             This is a 3D visulization application called DIVA.<br/>
             It lets the user upload a CSV file to visualize the<br/>
             3D visualixation of the data objects in the file.<br/>
             To use this web application use the following steps:<br/>
             1.Click on this button <img src={hamburger} className="hamburgerimg2" height = 'auto' width = '12px'/><br/> which is on the  top left most <br/>
             side of the menu.
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

	render() {
		return (
				<div>
				<div className="topbox">
				 <center><div className="boxaroundlogo">
				 <img src={logo} className="mainlogo" height = 'auto' width = '110px'/><br/>
				 </div></center></div>
         <button className='helpmenubutton' onClick={() => this.setState({checked2:!this.state.checked2})}>
         <img src={helpimg} className="helpimg" width = '26px' height = 'auto'/>
         </button><br/>
         {this.toggleHelpMenu()}
          <ThreeContainer />
         <button className='menubutton' onClick={() => this.setState({checked:!this.state.checked})}>
         <img src={hamburger} className="hamburgerimg" width = '26px' height = 'auto'/>
         </button><br/>
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
