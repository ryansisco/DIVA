import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import { get3dvObjectSort } from '../assets/js/csvParser.js';

import { updateGraphData } from '../redux/actions'

let firstUpdate = true;
let state = {
    filteredRows: {
        x: [],
        y: [],
        z: []
    },
    xOrder: "Ascending",
    yOrder: "Ascending",
    zOrder: "Ascending"
}

class FileFilter extends Component {
    constructor(props) {
        super(props);

        this.state = state;
    }

    componentWillUnmount() {
        state = this.state;
    }

    componentDidMount() {
        const graphData = this.props.graphData.data;
        if (firstUpdate && this.props.graphData.type === 'GRAPH_UPDATE') {
            firstUpdate = false;
            this.setState({
                filteredRows: {
                    x: graphData.xColumn.indices,
                    y: graphData.yColumn.indices,
                    z: graphData.zColumn.indices
                }
            })  
        }
    }

    componentDidUpdate() {
        const graphData = this.props.graphData.data;
        if (firstUpdate && this.props.graphData.type === 'GRAPH_UPDATE') {
            firstUpdate = false;
            this.setState({
                filteredRows: {
                    x: graphData.xColumn.indices,
                    y: graphData.yColumn.indices,
                    z: graphData.zColumn.indices
                }
            })  
        }
    }

	sortedType(howToSort, columnType){
		this.setState({
			...this.state,
			[columnType]: howToSort
		})
	}

	sendFilteredData(x, xOrder, xRows, y, yOrder, yRows, z, zOrder, zRows) {
        const graphData = this.props.graphData.data;
		var sortObject = {
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
        const columns = {
            x: graphData.xColumn.name,
            y: graphData.yColumn.name,
            z: graphData.zColumn.name
        }
		this.props.updateGraphData(get3dvObjectSort(this.props.file, columns, sortObject));
    }
    
    checkAll = axis => {
        const axisColumnString = axis + 'Column';
        var newarray = [...this.props.graphData.data[axisColumnString].indices ];
        this.setState({
            ...this.state,
            filteredRows: {
                ...this.state.filteredRows,
                [axis]: newarray
            }
        })
    }
    
    uncheckAll = axis => {
        this.setState({
            filteredRows: {
                ...this.state.filteredRows,
                [axis]: []
            }
        })
    }

    modifyArray(axis, rowoptions) {
        if (this.state.filteredRows[axis].includes(rowoptions)) {
            for (var q = 0; q < this.state.filteredRows[axis].length; q++){
                if (this.state.filteredRows[axis][q] == rowoptions) {
                    var newarray = [...this.state.filteredRows[axis]];
                    if (q !== -1) {
                        newarray.splice(q, 1);
                        this.setState({
                            ...this.state,
                            filteredRows: {
                                ...this.state.filteredRows,
                                [axis]: newarray
                            }
                        })
                    }
                }
            }
        }
        else {
            var newarray = [...this.state.filteredRows[axis]];
            newarray.push(rowoptions);
            this.setState({
                ...this.state,
                filteredRows: {
                    ...this.state.filteredRows,
                    [axis]: newarray
                }
            })
        }
	}

	produceCheckboxes(axis){
        const graphData = this.props.graphData.data;
        const axisColumnString = axis + 'Column';
		if (typeof(graphData[axisColumnString].indices) != "object") {
			return(
				<div>
                    <button className="toggleAllGrey" onClick={() => this.checkAll(axis, "true")}>Check All</button>
                    <button className="toggleallgrey" onClick={() => this.uncheckAll(axis)}>Uncheck All</button>
                    <form className="filteroptions">
                    <label key='0'><input type="checkbox" className="permchecked" name={axis} checked/> {myRow} </label>
                    </form>
				</div>
            )
		} else {
            return (
                <div>
                <button className="toggleAll" onClick={() => this.checkAll(axis, "true")}>Check All</button>
                <button className="toggleAll" onClick={() => this.uncheckAll(axis)}>Uncheck All</button>
                <form className="filteroptions">
                {Object.values(graphData[axisColumnString].indices).map((rowoptions, index) =>
                    <label key={index}><input type="checkbox" name={axis} checked={this.state.filteredRows[axis].includes(rowoptions)} onChange={() => this.modifyArray(axis, rowoptions)}/> {rowoptions} </label>)}
                </form>
                </div>
            );
		}
	}

    render() {
        const graphData = this.props.graphData.data;
        const graphDataReady = this.props.graphData.type === 'GRAPH_UPDATE';
        return (
            <div className="buttonInterior">
				<div className="sortandfilt">
				X-Axis:<br/>
				<input type="radio" value="Ascending" name="order" onChange={() => this.sortedType("Ascending", "xOrder")} checked ={this.state.xOrder === "Ascending"}/> Ascending
				<input type="radio" value="Descending" name="order" onChange={() => this.sortedType("Descending", "xOrder")} checked ={this.state.xOrder === "Descending"}/> Descending
				{graphDataReady ? this.produceCheckboxes("x") : null}
				</div>
				<div className="sortandfilt">
				Y-Axis:<br/>
				<input type="radio" value="Ascending" name="order2" onChange={() => this.sortedType("Ascending", "yOrder")} checked ={this.state.yOrder === "Ascending"}/> Ascending
				<input type="radio" value="Descending" name="order2" onChange={() => this.sortedType("Descending", "yOrder")} checked ={this.state.yOrder === "Descending"}/> Descending
				{graphDataReady ? this.produceCheckboxes("y") : null}
				</div>
				<div className="sortandfilt">
				Z-Axis:<br/>
				<input type="radio" value="Ascending" name="order3" onChange={() => this.sortedType("Ascending", "zOrder")} checked ={this.state.zOrder === "Ascending"}/> Ascending
				<input type="radio" value="Descending" name="order3" onChange={() => this.sortedType("Descending", "zOrder")} checked ={this.state.zOrder === "Descending"}/> Descending
				{graphDataReady ? this.produceCheckboxes("z") : null}
				</div>
				<button className="button" onClick={() => this.sendFilteredData((graphData.xColumn.indices), (this.state.xOrder),(this.state.filteredRows.x),(graphData.yColumn.indices), (this.state.yOrder),(this.state.filteredRows.y),(graphData.zColumn.indices), (this.state.zOrder),(this.state.filteredRows.z))}> Save Options </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(FileFilter);