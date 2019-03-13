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

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			xaxis: null,
			yaxis: null,
			zaxis: null,
			options: [],
			file: null
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
		document.title=process.env.TITLE;
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
				<button className="button">Filter</button><br/>
				<button className="button" onClick={() => this.props.updateGraphData(get3dvObject(this.state.file, columns))}>Render</button><br/>
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
				file: event.target.result,
				options: getTitles(event.target.result)
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
		if (this.state.checked) {
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
		return (
			<div></div>
		);
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

const mapStateToProps = state => ({
	graphData: state.graphData
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateGraphData
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);
