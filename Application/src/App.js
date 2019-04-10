import React, { Component } from "react";
// REDUX //
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateGraphData } from './redux/actions';

// COMPONENTS //
import Dropdown from 'react-dropdown';
import { getTitles, get3dvObject } from "./assets/js/csvParser.js";
import ThreeContainer from './components/DataVisualization/ThreeContainer';

// CSS //
import "./assets/css/styles.css";

// FILES //
import logo from './assets/img/logo.png';
import hamburger from './assets/img/hamburger.png';
import helpimg from './assets/img/helpimg.png';
import camera from './assets/img/camera.png';
import dropdownico from './assets/img/dropdown.png';
import chevron from './assets/img/chevron.png';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			axes: {
				x: null,
				y: null,
				z: null
			},
			options: [],
			csvfilename: null
		};
	}

	componentDidMount() {
		document.title=process.env.TITLE;
	}
	
	componentDidUpdate(prevProps, prevState) {
		if (prevState.axes !== this.state.axes && this.state.axes.x && this.state.axes.y && this.state.axes.z) {
			this.props.updateGraphData(get3dvObject(this.state.file, this.state.axes));
		}
	}
	
	exportImage = () => {
		var canvas = document.getElementById('visualizer');
		var image = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
		var link = document.createElement('a');
		link.download = "canvas-screenshot.jpeg";
		link.target = "_blank";
		link.href = image;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	onSelect = (option, e) => {
		this.setState({
			...this.state,
			axes: {
				...this.state.axes,
				[option]: e.value
			}
		})
	}

	onChangeFile = (event) =>{
		event.stopPropagation();
		event.preventDefault();
		var file = event.target.files[0];
		var reader = new FileReader();
		reader.onload = (event) => {
			this.setState({
				...this.state,
				file: event.target.result,
				options: getTitles(event.target.result),
				fileName: file.name
			});
		};
		reader.readAsText(file);
	}

	fileDialogue(){
		return (
		<div>
			<input
				className = "fileinput"
				type = "file"
				accept="csv"
				ref = {(ref) => this.upload = ref}
				onChange = {this.onChangeFile.bind(this)}
			/>
			<button
				className = "button"
				onClick = {() => {this.upload.click()}}
			>Choose File</button>
		</div>
		)
	}

	renderSelectFile(){
		if (this.state.selectFile) {
			return (
				<div>
					{this.fileDialogue()}
					{this.state.fileName ? <div className = "selectedfile">Selected File: {this.state.fileName}</div> : null}
					<form className ="dropdownmenu">
					X-Axis:<Dropdown options={this.state.options} onChange={e => this.onSelect('x', e)} value={this.state.axes.x} placeholder="..." /><br/>
					Y-Axis:<Dropdown options={this.state.options} onChange={e => this.onSelect('y', e)} value={this.state.axes.y} placeholder="..." /><br/>
					Z-Axis:<Dropdown options={this.state.options} onChange={e => this.onSelect('z', e)} value={this.state.axes.z} placeholder="..." />
					</form>
					<div className="addLine"></div>
				</div>
			)
		}
	}

	chooseOrder(event){
		console.log(event.target.value);
	}

	renderFileFilter(){
		if (this.state.fileFilter) {
			return (
				<div>
					{/* CALL TO COLLECT "IF OCCURS ONCE" Data */}
					X-Axis:<br/>
					<div onChange={this.chooseOrder.bind(this)}>
						<input type="radio" value="Original" defaultChecked name="order"/> Original
						<input type="radio" value="Ascending" name="order"/> Ascending
						<input type="radio" value="Descending" name="order"/> Descending
					</div>
					<form> {/* I need to set overflow for this in CSS so it is scrollable */}
						<input type="checkbox"/> Option 1
						<input type="checkbox"/> Option 2 <br/>
						<input type="checkbox"/> Option 3
						<input type="checkbox"/> Option 4 <br/>
					</form>
					Y-Axis:<br/>
					<div onChange={this.chooseOrder.bind(this)}>
						<input type="radio" value="Original" defaultChecked name="order2"/> Original
						<input type="radio" value="Ascending" name="order2"/> Ascending
						<input type="radio" value="Descending" name="order2"/> Descending
					</div>
					<form> {/* I need to set overflow for this in CSS so it is scrollable */}
						<input type="checkbox"/> Option 1
						<input type="checkbox"/> Option 2 <br/>
						<input type="checkbox"/> Option 3
						<input type="checkbox"/> Option 4 <br/>
					</form>
					Z-Axis:<br/>
					<div onChange={this.chooseOrder.bind(this)}>
						<input type="radio" value="Original" defaultChecked name="order3"/> Original
						<input type="radio" value="Ascending" name="order3"/> Ascending
						<input type="radio" value="Descending" name="order3"/> Descending
					</div>
					<form> {/* I need to set overflow for this in CSS so it is scrollable */}
						<input type="checkbox"/> Option 1
						<input type="checkbox"/> Option 2 <br/>
						<input type="checkbox"/> Option 3
						<input type="checkbox"/> Option 4 <br/>
					</form>
					<div className="addLine"></div>
				</div>
			)
		}
	}

	renderGraphicalOptions(){
		if (this.state.graphicOptions) {
			return (
				<div>
					graphic options
					<div className="addLine"></div>
				</div>
			)
		}
	}

	icocheck(myString, myVar){
		if (myVar) {
			return (
				<div>
				{myString}
				<img src={chevron} className="dropdownicoU" align="right"/>
				</div>
			)
		}
		else {
			return (
				<div>
				{myString}
				<img src={chevron} className="dropdownicoD" align="right"/>
				</div>
			)
		}
	}

	renderDataMenu(){
		if (this.state.dataMenu) {
			return (
				<div className = "menucontainer">
					<button className="uidropbutton" onClick={() => this.setState({selectFile:!this.state.selectFile})}>{this.icocheck("Select File", this.state.selectFile)}</button><br/>
					<div className="addLine"></div>
					{this.renderSelectFile()}
					<button className="uidropbutton" onClick={() => this.setState({fileFilter:!this.state.fileFilter})}>{this.icocheck("File Filter Options", this.state.fileFilter)}</button><br/>
					<div className="addLine"></div>
					{this.renderFileFilter()}
					<button className="uidropbutton" onClick={() => this.setState({graphicOptions:!this.state.graphicOptions})}>{this.icocheck("Graphic Options", this.state.graphicOptions)}</button><br/>
					<div className="addLine"></div>
					{this.renderGraphicalOptions()}
					<button className="uidropbutton" onClick={() => this.exportImage()}>Download Image</button><br/>
				</div>
			);
		}
		return (
			<div></div>
		);
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
			{this.renderDataMenu()}

			<img src={helpimg} className="helpimg" onClick={() => this.setState({helpMenu:!this.state.helpMenu})} width = '26px' height = 'auto'/>
			{this.renderHelpMenu()}

			<ThreeContainer />
			</div>
		);
	}
}

const mapStateToProps = state => ({
	graphData: state.graphData
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateGraphData
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);
