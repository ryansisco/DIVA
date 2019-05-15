import React, { Component } from 'react';
import { getRows, getTitles, get3dvObject } from '../assets/js/csvParser.js';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import { updateGraphData } from '../redux/actions';

import Dropdown from 'react-dropdown';

let state =  {
    options: [],
    axes: {
        x: null,
        y: null,
        z: null
    },
    rows: {
        x: [],
        y: [],
        z: []
    },
    filteredRows: {
        x: [],
        y: [],
        z: []
    },
    file: null
}

class SelectFile extends Component {
    constructor(props) {
        super(props);

        this.state = state;
    }

    componentWillUnmount() {
        state = this.state;
    }

	componentDidUpdate(prevProps, prevState) {
		if (prevState.axes !== this.state.axes && this.state.axes.x && this.state.axes.y && this.state.axes.z) {
			this.props.updateGraphData(get3dvObject(this.state.file, this.state.axes));
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
            this.props.getFile(event.target.result);
		};
		reader.readAsText(file);
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
			},
			filteredRows: {
				...this.state.filteredRows,
				[option]: getRows(this.state.file, e.value) 
			}
		})
	}

    render() {
        return (
            <div className="buttonInterior">
				<div>
                <input className = "fileinput" type = "file" accept=".csv" ref = {(ref) => this.upload = ref} onChange = {this.onChangeFile.bind(this)} />
                <button className = "button" onClick = {() => {this.upload.click()}}>Choose File</button>
			    </div>
				{this.state.fileName ? <div className = "selectedfile">Selected File: <a className="filename">{this.state.fileName}</a></div> : null}
				<form className ="dropdownmenu">
				X-Axis:<Dropdown options={this.state.options} onChange={e => this.onSelect('x', e)} value={this.state.axes.x} placeholder="..." /><br/>
				Y-Axis:<Dropdown options={this.state.options} onChange={e => this.onSelect('y', e)} value={this.state.axes.y} placeholder="..." /><br/>
				Z-Axis:<Dropdown options={this.state.options} onChange={e => this.onSelect('z', e)} value={this.state.axes.z} placeholder="..." />
				</form>
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

export default connect(mapStateToProps, mapDispatchToProps)(SelectFile);