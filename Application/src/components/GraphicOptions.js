import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SketchPicker } from 'react-color';
import { bindActionCreators } from "redux";

let state = {
	color: {
		x: null,
		y: [],
		z: [],
		Background: []
	}
	//Camera:{
			//reset:1
			//rotate:1
	//}
}

class GraphicOptions extends Component {
    constructor(props) {
        super(props);

        this.state = state;
	}

// Eli code/
	componentWillUnmount() {
		state = this.state;
	}

	toggleColorMenu = toggledAxis => {
				const newState = this.state;
				Object.keys(newState).map(axis => {
            if (axis === toggledAxis) {
                newState[axis] = !newState[axis];
            }
        })
        //this.setState(newState);
				this.setState({colorX:!this.state.colorX})
				this.setState({colorX:!this.state.colorY})
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
				</div>
				);
		}
	}

	renderColorZ(){
		const handleColorChange = ({ hex }) => console.log(hex);
		if (this.state.colorZ){
			return(
				<div>
				<SketchPicker
				color="#333"
				onChangeComplete={ handleColorChange }
				/>
				<button className = "button" onClick = {() => {this.setState()}}> Change Color </button>
				</div>
				);
		}
	}

	renderColorBackground(){
		const handleColorChange = ({ hex }) => console.log(hex);
		if (this.state.colorBackground){
			return(
				<div>
				<SketchPicker
				color="#333"
				onChangeComplete={ handleColorChange }
				/>
				<button className = "button" onClick = {() => {this.setState()}}> Change Color </button>
				</div>
				);
		}
	}


    render() {
				const graphData = this.props.graphData.data;
        return (
            <div>

						<div className="graphicOptionsBox">Type of Visualization<br/>
						<input type="radio" value="Ascending" name="order" onChange= {this.state.xOrder === "Ascending"}/> Blob data
						<input type="radio" value="Descending" name="order" onChange={this.state.xOrder === "Descending"}/> data
						<br/>Camera<br/>
						<button className = "button" onClick = {() => {this.setState()}}> Camera Reset </button>
						<input type="checkbox" value="Rotate" name="order"/> Enable Rotate
						<br/>Color Options<br/>
						<button className = "button" onClick = {() => {this.setState()}}> Background Color</button>
						{this.renderColorBackground()}
					  <button className="button"onClick = {() => this.toggleColorMenu('x')}>{graphData.xColumn ? graphData.xColumn.name : 'X'}</button>
						<button className="button"onClick = {() => this.toggleColorMenu('y')}>{graphData.yColumn ? graphData.yColumn.name : 'Y'}</button>
						<button className="button"onClick = {() => this.toggleColorMenu('z')}>{graphData.zColumn ? graphData.zColumn.name : 'Z'}</button>
						{this.renderColorX()}
						{this.renderColorY()}
						{this.renderColorZ()}
						<br/><br/>
						<button className = "button" onClick = {() => {this.setState()}}> Save Options </button>
						</div>
						<div className="addLine"></div>
		        </div>
        );
    }
}

const mapStateToProps = state => ({
	graphData: state.graphData
});

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GraphicOptions);
