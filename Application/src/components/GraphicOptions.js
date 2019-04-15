import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SketchPicker } from 'react-color';
import { bindActionCreators } from "redux";

let state = {
	x: null,
	y: null,
	z: null
}

class GraphicOptions extends Component {
    constructor(props) {
        super(props);

        this.state = state;
	}
	
	componentWillUnmount() {
		state = this.state;
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

    render() {
		const graphData = this.props.graphData.data;
        return (
            <div>

				<div>
				<button className = "button" onClick = {() => {this.setState()}}> Camera Reset </button>
				</div>

				<div className = "graphicOptionsBox">
				<button className="button"onClick = {() => {this.setState({colorX:!this.state.colorX})}}>{graphData ? graphData.xColumn.name : 'X'}</button>
				<button className="button"onClick = {() => {this.setState({colorY:!this.state.colorY})}}>{graphData ? graphData.yColumn.name : 'Y'}</button>
				<button className="button"onClick = {() => {this.setState({colorZ:!this.state.colorZ})}}>{graphData ? graphData.zColumn.name : 'Z'}</button>
				{this.renderColorX()}
				{this.renderColorY()}
				{this.renderColorZ()}

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