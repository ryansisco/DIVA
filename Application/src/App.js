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

	renderFileFilter(){
		if (this.state.fileFilter) {
			return (
				<div>
					filtering options
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
				<img src={dropdownico} className="dropdownicoU" align="right"/>
				</div>
			)
		}
		else {
			return (
				<div>
				{myString}
				<img src={dropdownico} className="dropdownicoD" align="right"/>
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
