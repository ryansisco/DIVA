import React, { Component } from 'react';
import { SketchPicker } from 'react-color';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import Dropdown from 'react-dropdown';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { updateGraphicOptions } from '../redux/actions';

let state = {
	color: {
		x: '#FF0000',
		y: '#00FF00',
		z: '#0000FF',
		d: '#FF00FF',
		background: 'white' 
	},
	colorMenus:{
		x: false,
		y: false,
		z: false,
		d: false
	},
	thickness:{
		a:1,
		b:2,
		c:3,
		d:4,
		e:5
	},
	visualization: 'scatterplot',
	rotate: false,
	axesLabels: true,
	axesNames: true
}

class GraphicOptions extends Component {
	constructor(props) {
		super(props);
		this.state = state;
	}

	componentWillUnmount() {
		state = this.state;
	}

	toggleColorMenu = toggledAxis => {
		const colorMenus = this.state.colorMenus;
		if (this.state.colorMenus[toggledAxis] === true) {
			Object.keys(colorMenus).map(axis => {
				colorMenus[axis] = false;
			})
		} else {
			Object.keys(colorMenus).map(axis => {
				if (axis !== toggledAxis) {
					colorMenus[axis] = false;
				} else  {
					colorMenus[axis] = true;
				}
			})
		}
		this.setState({
			...this.state,
			colorMenus
		});
	}

	renderColorPicker(axis) {
		if (this.state.colorMenus[axis]) {
			return(
				<SketchPicker
				color={this.state.color[axis]}
				onChange={ clr => this.setState({ color: { ...this.state.color, [axis]: clr.hex }})}
				/>
			);
		}
	}

    render() {
				const graphData = this.props.graphData.data;
        return (
						<div className="buttonInterior">

						<div className="graphicOptionsBox">Type of Visualization<br/>
						<input type="radio" value="cloud" onChange={() => this.setState({ visualization: 'cloud'})} checked= {this.state.visualization === "cloud"}/> Cloud
						<input type="radio" value="scatterplot" onChange={() => this.setState({ visualization: 'scatterplot'})} checked={this.state.visualization === "scatterplot"}/> Scatterplot
						<input type="radio" value="cluster" onChange={() => this.setState({ visualization: 'cluster'})} checked={this.state.visualization === "cluster"}/> Cluster
						</div>

						<div className="graphicOptionsBox">
						Camera Rotation<br/>
						<input type="radio" onChange={() => this.setState({ rotate: true})} checked={this.state.rotate}/> Enabled
						<input type="radio" onChange={() => this.setState({ rotate: false})} checked={!this.state.rotate}/> Disabled
						</div>
						
					  <div className="graphicOptionsBox"><br/>Color Options:<br/>
						<button className="button"onClick = {() => this.toggleColorMenu('x')}>{graphData.xColumn ? graphData.xColumn.name : 'X'}</button>
						<button className="button"onClick = {() => this.toggleColorMenu('y')}>{graphData.yColumn ? graphData.yColumn.name : 'Y'}</button>
						<button className="button"onClick = {() => this.toggleColorMenu('z')}>{graphData.zColumn ? graphData.zColumn.name : 'Z'}</button>
						<button className="button"onClick = {() => this.toggleColorMenu('d')}>Data Point</button>
						{this.renderColorPicker('x')}
						{this.renderColorPicker('y')}
						{this.renderColorPicker('z')}
						{this.renderColorPicker('d')}
						<br/><br/>
						Background Color:
						<form className ="dropdownmenu">
						<Dropdown options={['white', 'black']}
							value={this.state.color.background}
							onChange={e => this.setState({ ...this.state, color: { ...this.state.color, background: e.value } })}/>
						</form>
						</div>

						<div className="graphicOptionsBox">
						Axes Labels<br/>
						<input type="radio" onChange={() => this.setState({ axesLabels: true})} checked={this.state.axesLabels}/> Enabled
						<input type="radio" onChange={() => this.setState({ axesLabels: false})} checked={!this.state.axesLabels}/> Disabled
						</div>
						<br/>
						
						<div className="graphicOptionsBox">
						<button className = "button" onClick = {() => this.props.updateGraphicOptions(this.state)}> Save Options </button>
						</div>
						<div className="addLine"></div>
		        </div>
        );
    }
}

const mapStateToProps = state => ({
	graphicOptions: state.graphicOptions,
	graphData: state.graphData	
});

const mapDispatchToProps = dispatch => bindActionCreators({
	updateGraphicOptions
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GraphicOptions);