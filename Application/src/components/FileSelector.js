import React, { Component } from 'react';

import Popup from 'react-popup';

function buildFileSelector(){
  const fileSelector = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.setAttribute('multiple', 'multiple');
  return fileSelector;
}

class FileDialogue extends Component {
  componentDidMount(){
    this.fileSelector = buildFileSelector();
  }

  handleFileSelect = (e) => {
    e.preventDefault();
    this.fileSelector.click();
  }

  render(){
    return <button className="button" href="" onClick={this.handleFileSelect}>Upload file</button>
  }
}

export default FileDialogue
