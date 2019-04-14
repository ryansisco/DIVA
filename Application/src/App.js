import React, { Component } from "react";
// REDUX //
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateGraphData } from './redux/actions';

// COMPONENTS //
import Dropdown from 'react-dropdown';
import { getTitles, get3dvObjectSort, get3dvObject, getRows} from "./assets/js/csvParser.js";
import ThreeContainer from './components/DataVisualization/ThreeContainer';
import { SketchPicker } from 'react-color';
import Slider, {Range} from 'rc-slider';
import 'rc-slider/assets/index.css';

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
			rows: {	/* this is here to keep the "old" data saved for checkboxes to re select an item. It should be copied from rows on x,y,or z axis changed*/
				x: [],
				y: [],
				z: []
			},
			filteredRows: {
				x: [],
				y: [],
				z: []
			},
			xOrder: "Original",
			yOrder: "Original",
			zOrder: "Original",
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
			console.log(this.state.rows);
		}
	}

	exportImage = () => {
		var canvas = document.getElementById('visualizer');
		var image = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
		var link = document.createElement('a');
		link.download = this.state.csvfilename+".jpeg";
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
			},
			rows: {
				...this.state.rows,
				[option]: getRows(this.state.file, e.value)
				/* getRows(this.state.file, this.state.axes.option)*/
			},
			filteredRows: {
				...this.state.filteredRows,
				[option]: getRows(this.state.file, e.value) /* getRows(this.state.file, this.state.axes.option)*/
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
				fileName: file.name,
				csvfilename: file.name
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

	checkAllToggle(mystring, myoption){
		if (myoption == "false"){
			if (mystring == "xaxisvars"){
				this.setState({
					...this.state,
					filteredRows: {
						...this.state.filteredRows,
						x: []
					}
				})
			}
			if (mystring == "yaxisvars"){
				this.setState({
					...this.state,
					filteredRows: {
						...this.state.filteredRows,
						y: []
					}
				})
			}
			if (mystring == "zaxisvars"){
				this.setState({
					...this.state,
					filteredRows: {
						...this.state.filteredRows,
						z: []
					}
				})
			}
		}
		if (myoption == "true"){
			if (mystring == "xaxisvars"){
				var newarray = [...this.state.rows.x];
				this.setState({
					...this.state,
					filteredRows: {
						...this.state.filteredRows,
						x: newarray
					}
				})
			}
			if (mystring == "yaxisvars"){
				var newarray = [...this.state.rows.y];
				this.setState({
					...this.state,
					filteredRows: {
						...this.state.filteredRows,
						y: newarray
					}
				})
			}
			if (mystring == "zaxisvars"){
				var newarray = [...this.state.rows.z];
				this.setState({
					...this.state,
					filteredRows: {
						...this.state.filteredRows,
						z: newarray
					}
				})
			}
		}
	}

	modifyArray(rowName, rowoptions) {
		if (rowName == "xaxisvars") {
			if (this.state.filteredRows.x.includes(rowoptions)) {
				for (var q = 0; q < this.state.filteredRows.x.length; q++){
					if (this.state.filteredRows.x[q] == rowoptions) {
						var newarray = [...this.state.filteredRows.x];
						if (q !== -1) {
							newarray.splice(q, 1);
							this.setState({
								...this.state,
								filteredRows: {
									...this.state.filteredRows,
									x: newarray
								}
							})
						}
					}
				}
			}
			else {
				var newarray = [...this.state.filteredRows.x];
				newarray.push(rowoptions);
				this.setState({
					...this.state,
					filteredRows: {
						...this.state.filteredRows,
						x: newarray
					}
				})
			}
		}
		if (rowName == "yaxisvars") {
			if (this.state.filteredRows.y.includes(rowoptions)) {
				for (var q = 0; q < this.state.filteredRows.y.length; q++){
					if (this.state.filteredRows.y[q] == rowoptions) {
						var newarray = [...this.state.filteredRows.y];
						if (q !== -1) {
							newarray.splice(q, 1);
							this.setState({
								...this.state,
								filteredRows: {
									...this.state.filteredRows,
									y: newarray
								}
							})
						}
					}
				}
			}
			else {
				var newarray = [...this.state.filteredRows.y];
				newarray.push(rowoptions);
				this.setState({
					...this.state,
					filteredRows: {
						...this.state.filteredRows,
						y: newarray
					}
				})
			}
		}
		if (rowName == "zaxisvars") {
			if (this.state.filteredRows.z.includes(rowoptions)) {
				for (var q = 0; q < this.state.filteredRows.z.length; q++){
					if (this.state.filteredRows.z[q] == rowoptions) {
						var newarray = [...this.state.filteredRows.z];
						if (q !== -1) {
							newarray.splice(q, 1);
							this.setState({
								...this.state,
								filteredRows: {
									...this.state.filteredRows,
									z: newarray
								}
							})
						}
					}
				}
			}
			else {
				var newarray = [...this.state.filteredRows.z];
				newarray.push(rowoptions);
				this.setState({
					...this.state,
					filteredRows: {
						...this.state.filteredRows,
						z: newarray
					}
				})
			}
		}
	}

	produceCheckboxes(myRow, rowName){
		if (rowName == "xaxisvars")
			var whatcolumn = "x";
		if (rowName == "yaxisvars")
			var whatcolumn = "y";
		if (rowName == "zxaxisvars")
			var whatcolumn = "z";
		if (typeof(myRow) != "object") {
			return(
				<div>
				<button className="toggleAllGrey" onClick={() => this.checkAllToggle(rowName, "true")}>Check All</button>
				<button className="toggleallgrey" onClick={() => this.checkAllToggle(rowName, "false")}>Uncheck All</button>
				<form className="filteroptions">
				<label key='0'><input type="checkbox" className="permchecked" name={rowName} checked/> {myRow} </label>
				</form>
				</div>
				)
		}
		else{
			if (rowName == "xaxisvars") {
				return(
					<div>
					<button className="toggleAll" onClick={() => this.checkAllToggle(rowName, "true")}>Check All</button>
					<button className="toggleAll" onClick={() => this.checkAllToggle(rowName, "false")}>Uncheck All</button>
					<form className="filteroptions">
					{(Object.values(myRow)).map((rowoptions, index) =>
						<label key={index}><input type="checkbox" name={rowName} checked={this.state.filteredRows.x.includes(rowoptions)} onChange={() => this.modifyArray(rowName, rowoptions)}/> {rowoptions} </label>)}
					</form>
					</div>
				)
			}
			if (rowName == "yaxisvars") {
				return(
					<div>
					<button className="toggleAll" onClick={() => this.checkAllToggle(rowName, "true")}>Check All</button>
					<button className="toggleAll" onClick={() => this.checkAllToggle(rowName, "false")}>Uncheck All</button>
					<form className="filteroptions">
					{(Object.values(myRow)).map((rowoptions, index) =>
						<label key={index}><input type="checkbox" name={rowName} checked={this.state.filteredRows.y.includes(rowoptions)} onChange={() => this.modifyArray(rowName, rowoptions)}/> {rowoptions} </label>)}
					</form>
					</div>
				)
			}
			if (rowName == "zaxisvars") {
				return(
					<div>
					<button className="toggleAll" onClick={() => this.checkAllToggle(rowName, "true")}>Check All</button>
					<button className="toggleAll" onClick={() => this.checkAllToggle(rowName, "false")}>Uncheck All</button>
					<form className="filteroptions">
					{(Object.values(myRow)).map((rowoptions, index) =>
						<label key={index}><input type="checkbox" name={rowName} checked={this.state.filteredRows.z.includes(rowoptions)} onChange={() => this.modifyArray(rowName, rowoptions)}/> {rowoptions} </label>)}
					</form>
					</div>
				)
			}
		}
	}

	sortedType(howToSort, columnType){
		this.setState({
			...this.state,
			xOrder: "Original",
			yOrder: "Original",
			zOrder: "Original",
			[columnType]: howToSort
		})
	}

	sendFilteredData(x, xOrder, xRows, y, yOrder, yRows, z, zOrder, zRows) {
		var mySortObject = {
			"x": x,
			"x_sort": xOrder,
			"x_filter": xRows,
			"y": y,
			"y_sort": yOrder,
			"y_filter": yRows,
			"z": z,
			"z_sort": zOrder,
			"z_filter": zRows
		}
		this.props.updateGraphData(get3dvObjectSort(this.state.file, this.state.axes, mySortObject));
	}

	renderFileFilter() {
		if (this.state.fileFilter) {
			return (
				<div>
				<div className="sortandfilt">
				X-Axis:<br/>
				<input type="radio" value="Original" name="order" onChange={() => this.sortedType("Original", "xOrder")} checked ={this.state.xOrder === "Original"}/> Original
				<input type="radio" value="Ascending" name="order" onChange={() => this.sortedType("Ascending", "xOrder")} checked ={this.state.xOrder === "Ascending"}/> Ascending
				<input type="radio" value="Descending" name="order" onChange={() => this.sortedType("Descending", "xOrder")} checked ={this.state.xOrder === "Descending"}/> Descending
				{this.produceCheckboxes(this.state.rows.x, "xaxisvars")}
				</div>
				<div className="sortandfilt">
				Y-Axis:<br/>
				<input type="radio" value="Original" name="order2" onChange={() => this.sortedType("Original", "yOrder")} checked ={this.state.yOrder === "Original"}/> Original
				<input type="radio" value="Ascending" name="order2" onChange={() => this.sortedType("Ascending", "yOrder")} checked ={this.state.yOrder === "Ascending"}/> Ascending
				<input type="radio" value="Descending" name="order2" onChange={() => this.sortedType("Descending", "yOrder")} checked ={this.state.yOrder === "Descending"}/> Descending
				{this.produceCheckboxes(this.state.rows.y, "yaxisvars")}
				</div>
				<div className="sortandfilt">
				Z-Axis:<br/>
				<input type="radio" value="Original" name="order3" onChange={() => this.sortedType("Original", "zOrder")} checked ={this.state.zOrder === "Original"}/> Original
				<input type="radio" value="Ascending" name="order3" onChange={() => this.sortedType("Ascending", "zOrder")} checked ={this.state.zOrder === "Ascending"}/> Ascending
				<input type="radio" value="Descending" name="order3" onChange={() => this.sortedType("Descending", "zOrder")} checked ={this.state.zOrder === "Descending"}/> Descending
				{this.produceCheckboxes(this.state.rows.z, "zaxisvars")}
				</div>
				<button className="Rerender" onClick={() => this.sendFilteredData((this.state.axes.x), (this.state.xOrder),(this.state.filteredRows.x),(this.state.axes.y), (this.state.yOrder),(this.state.filteredRows.y),(this.state.axes.z), (this.state.zOrder),(this.state.filteredRows.z))}> Save Options </button>
				<div className="addLine"></div>
				</div>
				)
		}
	}

	renderColorX(){
		const handleColorChange = ({ hex }) => console.log(hex);
		if (this.state.colorX){
			return(
				<div>
				<SketchPicker
				color="#333"
				onChangeComplete={ handleColorChange }
				/>
				<button className = "button" onClick = {() => {this.setState()}}> Change Color </button>
				<Slider />
				</div>
				);
		}
	}

	renderColorY(){
		const handleColorChange = ({ hex }) => console.log(hex);
		if (this.state.colorY){
			return(
				<div>
				<SketchPicker
				color="#333"
				onChangeComplete={ handleColorChange }
				/>
				<button className = "button" onClick = {() => {this.setState()}}> Change Color </button>
				<Slider />
				</div>
				);
		}
	}

	renderColorZ(){
		const handleColorChange = ({ hex }) => console.log(hex);
		if (this.state.colorZ){
			return(
				<div className = "menucontainer">
				<SketchPicker
				color="#333"
				onChangeComplete={ handleColorChange }
				/>
				<button className = "button" onClick = {() => {this.setState()}}> Change Color </button>
				<Slider />
				</div>
				);
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

	renderGraphicalOptions(){
		if (this.state.graphicOptions) {
			return (
				<div>

				<div>
				<button className = "button" onClick = {() => {this.setState()}}> Camera Reset </button>
				</div>

				<div>
				<button className="button"onClick = {() => {this.setState({colorX:!this.state.colorX})}}> X-Axis</button>
				{this.renderColorX()}
				<button className="button"onClick = {() => {this.setState({colorY:!this.state.colorY})}}> Y-Axis</button>
				{this.renderColorY()}
				<button className="button"onClick = {() => {this.setState({colorZ:!this.state.colorZ})}}> Z-Axis</button>
				{this.renderColorZ()}
				</div>

				<div className="addLine"></div>

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
