import React, { Component } from 'react';
import { SketchPicker } from 'react-color';
import ReactDom from 'react-dom';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css'
import Slider from 'rc-slider';
import Tooltip from 'rc-slider';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { updateGraphData } from '../redux/actions';

let state = {
	color: {
		x: null,
		y: null,
		z: null
	},
	thickness:{
		a:1,
		b:2,
		c:3
	},
	backgroundColor:
		 'White'
	,
	visualization:
		'Scatter'
	,
	rotaion:true,
	axesLabels: true,
	axesNames:false

}

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const Handle = Slider.Handle;

const handle = (props) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

const wrapperStyle = { width: 200, margin: 20 };

class GraphicOptions extends Component {
    constructor(props) {
        super(props);

        this.state = state;
	}

	componentWillUnmount() {
		state = this.state;
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.axes !== this.state.axes && this.state.axes.x && this.state.axes.y && this.state.axes.z) {
			this.props.updateGraphData(get3dvObject(this.state.file, this.state.axes, this.state.color, this.state.BackgroundColor, this.state.LineThickness));
		}
		}

	toggleColorMenu = toggledAxis => {
				const newState = this.state;
				Object.keys(newState).map(axis => {
            if (axis === toggledAxis) {
                newState[axis] = !newState[axis];
            }
        });
        this.setState(newState);

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

//this.setState({ visualization: 'cloud' })

    render() {
				const graphData = this.props.graphData.data;
        return (
            <div>

						<div className="sortandfilt">  Type of Visualization<br/>
						<input type="radio" value="Cloud" name="order" onChange={() => this.setState({ visualization: 'cloud'})} checked= {this.state.visualization === "cloud"}/> Cloud
						<input type="radio" value="Scatter" name="order" onChange={() => this.setState({ visualization: 'scatter'})} checked={this.state.visualization === "scatter"}/> Scatter
						</div>
						<div className="graphicOptionsBox"><br/>Camera<br/>
						<button className = "button" onClick = {() => {this.setState()}}> Camera Reset </button>
						<input type="checkbox" value="Rotate" name="order2" onChange={() => this.setState({ rotation:true})}/> Enable Rotate
						</div>
						<div className="sortandfilt"><br/>Background Color<br/>
						<input type="radio" value="Black" name="order3" onChange={() => this.setState({backgroundColor: 'black'})} checked= {this.state.backgroundColor === "black"}/> Black
						<input type="radio" value="White" name="order4" onChange={() => this.setState({backgroundColor: 'white'})}checked={this.state.backgroundColor === "white"}/> White
						</div>
					  <div className="graphicOptionsBox"><br/>Color Options<br/>
						<button className="button"onClick = {() => this.toggleColorMenu('x')}>{graphData.xColumn ? graphData.xColumn.name : 'X'}</button>
						<button className="button"onClick = {() => this.toggleColorMenu('y')}>{graphData.yColumn ? graphData.yColumn.name : 'Y'}</button>
						<button className="button"onClick = {() => this.toggleColorMenu('z')}>{graphData.zColumn ? graphData.zColumn.name : 'Z'}</button>
						{this.renderColorX()}
						{this.renderColorY()}
						{this.renderColorZ()}
						</div>
						<div className="graphicOptionsBox"><br/>Hide<br/>
						<input type="checkbox" value="Rotate" name="order" onChange={() => this.setState({ 	axesLabels: true})}/> Axes Labels
						<input type="checkbox" value="Rotate" name="order" onChange={() => this.setState({ axesNames:false})}/> Axes Name
						</div>
						<div style={wrapperStyle}>
							<p> Line Thickness</p>
							<Slider min={1} max={5} defaultValue={1} marks={{ 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 }} tipFormatter={value => `${value}%`} step={null} />
						</div>
						<div className="graphicOptionsBox">
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
	updateGraphData
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GraphicOptions);
