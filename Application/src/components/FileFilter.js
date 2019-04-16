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
    rows: {
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
        if (firstUpdate) {
            
            firstUpdate = false;
            this.setState({
                filteredRows: {
                    x: graphData.xColumn.indices,
                    y: graphData.yColumn.indices,
                    z: graphData.zColumn.indices
                },
                rows: {
                    x: graphData.xColumn.indices,
                    y: graphData.yColumn.indices,
                    z: graphData.zColumn.indices
                }
            })  
        }
    }

    componentDidUpdate(prevProps) {
        const graphData = this.props.graphData.data;
        if (graphData !== prevProps.graphData.data) {
            this.setState({
                filteredRows: {
                    x: graphData.xColumn.indices,
                    y: graphData.yColumn.indices,
                    z: graphData.zColumn.indices
                },
                rows: {
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
		if (typeof(this.state.rows[axis]) != "object") {
			return(
				<div>
                    <button className="toggleAllGrey" onClick={() => this.checkAllToggle(axis, "true")}>Check All</button>
                    <button className="toggleallgrey" onClick={() => this.checkAllToggle(axis, "false")}>Uncheck All</button>
                    <form className="filteroptions">
                    <label key='0'><input type="checkbox" className="permchecked" name={axis} checked/> {myRow} </label>
                    </form>
				</div>
            )
		} else {
            return (
                <div>
                <button className="toggleAll" onClick={() => this.checkAllToggle(axis, "true")}>Check All</button>
                <button className="toggleAll" onClick={() => this.checkAllToggle(axis, "false")}>Uncheck All</button>
                <form className="filteroptions">
                {(Object.values(this.state.rows[axis])).map((rowoptions, index) =>
                    <label key={index}><input type="checkbox" name={axis} checked={this.state.filteredRows[axis].includes(rowoptions)} onChange={() => this.modifyArray(axis, rowoptions)}/> {rowoptions} </label>)}
                </form>
                </div>
            );
		}
	}

    render() {
        return (
            <div>
				<div className="sortandfilt">
				X-Axis:<br/>
				<input type="radio" value="Ascending" name="order" onChange={() => this.sortedType("Ascending", "xOrder")} checked ={this.state.xOrder === "Ascending"}/> Ascending
				<input type="radio" value="Descending" name="order" onChange={() => this.sortedType("Descending", "xOrder")} checked ={this.state.xOrder === "Descending"}/> Descending
				{this.produceCheckboxes("x")}
				</div>
				<div className="sortandfilt">
				Y-Axis:<br/>
				<input type="radio" value="Ascending" name="order2" onChange={() => this.sortedType("Ascending", "yOrder")} checked ={this.state.yOrder === "Ascending"}/> Ascending
				<input type="radio" value="Descending" name="order2" onChange={() => this.sortedType("Descending", "yOrder")} checked ={this.state.yOrder === "Descending"}/> Descending
				{this.produceCheckboxes("y")}
				</div>
				<div className="sortandfilt">
				Z-Axis:<br/>
				<input type="radio" value="Ascending" name="order3" onChange={() => this.sortedType("Ascending", "zOrder")} checked ={this.state.zOrder === "Ascending"}/> Ascending
				<input type="radio" value="Descending" name="order3" onChange={() => this.sortedType("Descending", "zOrder")} checked ={this.state.zOrder === "Descending"}/> Descending
				{this.produceCheckboxes("z")}
				</div>
				<button className="Rerender" onClick={() => this.sendFilteredData((this.state.rows.x), (this.state.xOrder),(this.state.filteredRows.x),(this.state.rows.y), (this.state.yOrder),(this.state.filteredRows.y),(this.state.rows.z), (this.state.zOrder),(this.state.filteredRows.z))}> Save Options </button>
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