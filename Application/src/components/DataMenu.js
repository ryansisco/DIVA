import React, { Component } from 'react';

// COMPONENTS //
import SelectFile from './SelectFile';
import FileFilter from './FileFilter';
import GraphicOptions from './GraphicOptions';

// ASSETS //
import chevron from '../assets/img/chevron.png';

export default class DataMenu extends Component {  
    constructor(props) {
        super(props);
        
        this.state = {
            selectFile: false,
            fileFilter: false,
            graphicOptions: false
        }
    }

    saveFile = file => {
        this.setState({
            file
        });
    }

    toggleDropdown = toggledDropdown => {
        const newState = this.state;
        Object.keys(newState).map(dropdown => {
            if (dropdown === toggledDropdown) {
                newState[dropdown] = !newState[dropdown];
            } else if (dropdown !== 'file') {
                newState[dropdown] = false;
            }
        })
        this.setState(newState);
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

    render () {
        return (
        <div className = "menucontainer">
            <button className="uidropbutton" onClick={() => this.toggleDropdown('selectFile')}>{this.icocheck("Select File", this.state.selectFile)}</button><br/>
            <div className="addLine"></div>
            {this.state.selectFile ? <SelectFile getFile={file => this.saveFile(file)}/> : null}
            <button className="uidropbutton" onClick={() => this.toggleDropdown('fileFilter')}>{this.icocheck("File Filter Options", this.state.fileFilter)}</button><br/>
            <div className="addLine"></div>
            {this.state.fileFilter ? <FileFilter file={this.state.file}/> : null}
            <button className="uidropbutton" onClick={() => this.toggleDropdown('graphicOptions')}>{this.icocheck("Graphic Options", this.state.graphicOptions)}</button><br/>
            <div className="addLine"></div>
            {this.state.graphicOptions ? <GraphicOptions /> : null}
            <button className="uidropbutton" onClick={() => this.exportImage()}>Download Image</button><br/>
        </div>
        );
    }
}
