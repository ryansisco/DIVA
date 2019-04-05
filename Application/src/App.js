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

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			xaxis: null,
			yaxis: null,
			zaxis: null,
			options: [],
			csvfilename: null
		};
		this.onSelect = this.onSelect.bind(this);
	}

	componentDidMount() {
		document.title=process.env.TITLE;
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

    onSelect (option, e) {
		this.setState({
			...this.state,
			[option]: e.value
		})
	}

	renderReady(){
		if ((this.state.xaxis === this.state.yaxis) || (this.state.yaxis === this.state.zaxis) || (this.state.xaxis === this.state.zaxis) ||
				(!this.state.xaxis) || (!this.state.yaxis) || (!this.state.zaxis)) {
			return (
				<div>
				<button className="notreadybutton">Filter</button><br/>
				<button className="notreadybutton">Render</button><br/>
				<button className="notreadybutton">Download</button><br/>
				</div>
			)
		}
		else {
			const columns = {
				x: this.state.xaxis,
				y: this.state.yaxis,
				z: this.state.zaxis
			}
			return (
				<div>
				<button className="button" onClick={() => this.setState({filterMenu:!this.state.filterMenu})}>Filter</button><br/>{this.renderFilterOptions()}
				<button className="button" onClick={() => this.props.updateGraphData(get3dvObject(this.state.file, columns))}>Render</button><br/>
				<button className="button" onClick={() => this.exportImage()}>Download</button><br/>
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
			>Select File</button>
		</div>
		)
	}

	renderDataMenu(){
		if (this.state.dataMenu) {
            return (
                <div className = "menucontainer">
                    {this.fileDialogue()}
                    {this.state.fileName ? <div className = "selectedfile">Selected File: {this.state.fileName}</div> : null}
                    <form className ="dropdownmenu">
                    X-Axis:<Dropdown options={this.state.options} onChange={e => this.onSelect('xaxis', e)} value={this.state.xaxis} placeholder="..." /><br/>
                    Y-Axis:<Dropdown options={this.state.options} onChange={e => this.onSelect('yaxis', e)} value={this.state.yaxis} placeholder="..." /><br/>
                    Z-Axis:<Dropdown options={this.state.options} onChange={e => this.onSelect('zaxis', e)} value={this.state.zaxis} placeholder="..." />
                    </form>
                    {this.renderReady()}
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
                    This is a 3D visulization application called DIVA.<br/>
                    It lets the user upload a CSV file to visualize the<br/>
                    3D visualization of the data objects in the file.<br/> <br/>
                    To use this web application use the following steps:<br/>
                    1.Click on this button <img src={hamburger} className="hamburgerimg2" height = 'auto' width = '12px'/> which is on the top left most <br/>
                    side of the menu. This will pop up a window <br/>
                    with different options.<br/> <br/>
                    2. By pressing the Select File button you can choose <br/>
                    a CSV file, after which it is selected the user can  <br/>
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
        return (
            <div></div>
        );
    }

    renderCameraMenu(){
        if (this.state.cameraMenu) {
            return (
                <div className = "cameramenucontainer">
                    <form className ="dropdowncameramenu">
                    Camera Options
                    </form>
                </div>
            );
        }
        return (
            <div></div>
        );
    }

    renderFilterOptions(){
    	if (this.state.filterMenu) {
    		console.log("ree2");
    		return (
    			<div className = "filtercontainer">
    			stuff goes here
    			</div>
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

         	<img src={hamburger} className="hamburgerimg" onClick={() => this.setState({dataMenu:!this.state.dataMenu})} width = '26px' height = 'auto'/>
         	{this.renderDataMenu()}

            <img src={helpimg} className="helpimg" onClick={() => this.setState({helpMenu:!this.state.helpMenu})} width = '26px' height = 'auto'/>
            {this.renderHelpMenu()}

            <img src={camera} className="camera" onClick={() => this.setState({cameraMenu:!this.state.cameraMenu})} width = '26px' height = 'auto'/>
            {this.renderCameraMenu()}

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
