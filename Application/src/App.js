import React, { Component } from "react";

// COMPONENTS //
import ThreeContainer from './components/DataVisualization/ThreeContainer';

// CSS //
import "./assets/css/styles.css";

// FILES //
import logo from './assets/img/logo.png';
import hamburger from './assets/img/hamburger.png';
import helpimg from './assets/img/helpimg.png';
import DataMenu from "./components/DataMenu";

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataMenu: false,
			helpMenu: false
		};
	}

	componentDidMount() {
		document.title=process.env.TITLE;
	}

	renderHelpMenu(){
		if (this.state.helpMenu) {
			return (
				<div className = "helpmenucontainer">
				<form className ="dropdownhelpmenu">
				This is a 3D visulization application called Data Interactive
				Visualization Application, or DIVA. DIVA was designed in order
				to give security experts a better understanding of different
				malware and how they are spreading. DIVA allows you to take
				data and generate creative 3D models in order to gather
				assumptions, correlations, and predictions of malware.<br/><br/>
				To use this web application use the following steps:<br/>
				<ol>
				<li>Click on this button <img src={hamburger} className="hamburgerimg2" height = 'auto' width = '12px'/> which is on the top left most
				side of the menu. This will show a dropdown menu with options.</li>
				<li>Choose the <b>"Select File"</b> menu to get started with your file. This
				will allow you to pick a local file, and choose the X, Y, and Z axes.
				At this point, the visualization will automatically render.</li>
				<li>On the <b>"File Filter Options"</b> menu, your file will have populated a 
				field full of your rows for each axis. You can choose what you would like to
				include in your data. You will also have the option to sort each axis.</li>
				<li><b>"Graphic Options"</b> allows you to choose different colors, patterns, and visualization
				options for your data.</li>
				<li>Once you are satisfied with your graph, you can choose <b>"Download"</b> and a screen grab of
				the graph in its current position.</li>
				</ol>

				</form>
				</div>
				);
		}
		return (
			<div></div>
			);
	}

	render() {
		return (
			<div>
			<div className="topbox">
			<center><div className="boxaroundlogo">
			<img src={logo} className="mainlogo" height = 'auto' width = '110px'/><br/>
			</div></center></div>

			<img src={hamburger} className="hamburgerimg" onClick={() => this.setState({dataMenu:!this.state.dataMenu})} width = '26px' height = 'auto'/>
			<DataMenu />

			<img src={helpimg} className="helpimg" onClick={() => this.setState({helpMenu:!this.state.helpMenu})} width = '26px' height = 'auto'/>
			{this.renderHelpMenu()}

			<ThreeContainer />
			</div>
			);
	}
}