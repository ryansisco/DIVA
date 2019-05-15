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
		x: [],
		y: [],
		z: []
	},
	thickness:{
		a:1,
		b:2,
		c:3
	},
	backgroundColor:
		 'white'
	,
	visualization:
		'scater'
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

const wrapperStyle = { width: 400, margin: 50 };

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
        })
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
//this.setState({ visualization: 'cloud' })

    render() {
				const graphData = this.props.graphData.data;
        return (
            <div>

						<div className="graphicOptionsBox">Type of Visualization<br/>
						<input type="radio" value="Cloud" name="order" onChange={() => this.setState( "visualization: cloud")} checked= {this.state.visualization === "cloud"}/> Cloud
						<input type="radio" value="Scater" name="order"onChange={() => this.setState( "visualization: scatter")} checked={this.state.visualization === "Scater"}/> Scater
						<br/><br/>Camera<br/>
						<button className = "button" onClick = {() => {this.setState()}}> Camera Reset </button>
						<input type="checkbox" value="Rotate" name="order"/> Enable Rotate
						<br/><br/>Background Color<br/>
						<input type="radio" value="Black" name="order" onChange={() => this.setState( "backgroundColor: black")} checked= {this.state.backgroundColor === "Black"}/> Black
						<input type="radio" value="White" name="order" onChange={() => this.setState( "backgroundColor: white")}checked={this.state.backgroundColor === "White"}/> White
						<br/><br/>Color Options<br/>
						<button className="button"onClick = {() => this.toggleColorMenu('x')}>{graphData.xColumn ? graphData.xColumn.name : 'X'}</button>
						<button className="button"onClick = {() => this.toggleColorMenu('y')}>{graphData.yColumn ? graphData.yColumn.name : 'Y'}</button>
						<button className="button"onClick = {() => this.toggleColorMenu('z')}>{graphData.zColumn ? graphData.zColumn.name : 'Z'}</button>
						{this.renderColorX()}
						{this.renderColorY()}
						{this.renderColorZ()}
						<br/><br/>Thickness<br/>
						<div style={wrapperStyle}>
							<p>Slider with fixed values</p>
							<Slider min={20} defaultValue={20} marks={{ 20: 20, 40: 40, 100: 100 }} step={null} />
							</div>
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
	updateGraphData
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GraphicOptions);
