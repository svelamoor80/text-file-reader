import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

class DisplayLeft extends Component {
  constructor(props) {
    super(props);
    this.state = { files: [] };
    this.handleFiles = this.handleFiles.bind(this);

  }
  handleFiles(e) {
    e.preventDefault();
    var files = e.target.files;
    console.log('files' + files.length);
    this.setState({ files });
    this.props.setFileRelatedFlags(files);
    // files ? this.setState({ filesSelected: true, files }) : this.setState({ filesSelected: false });
  }
  render() {
    return (<div className='split left'>
      <div className="centered">
        <input type="file" id="fileElem" onChange={this.handleFiles} />
        <div id="fileList">
          {
            this.state.files.length ? (<DisplayFile files={this.state.files} />) : ("")
          }
        </div>
      </div>
    </div>)
  }
}
class DisplayRight extends Component {
  constructor(props) {
    super(props);
    this.state = { content: '' };
  }
  componentWillUpdate() {
    let receivedFiles = this.props.files();
    //let _self = this;
    if (receivedFiles.length) {
      resolvePromise(receivedFiles[0])
        .then(function (result) {
          this.setState({ content: result });
        }.bind(this));
    }
  }
  render() {
    return (
      <div className="split right">
        <div className="centered">
          {this.state.content}
        </div>
      </div>
    )
  }
}



function DisplayFile(props) {
  console.log(typeof props.files);
  return (
    <ul>
      {Object.keys(props.files).map((key) => {
        return (<li>{props.files[key].name}</li>);
      })
      }
    </ul>
  );
}
function resolvePromise(file) {
  console.log('inside resolve promise' + file);
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = () => {
      resolve(reader.result);
    };
  });

}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = { files: [] };
    this.setFileRelatedFlags = this.setFileRelatedFlags.bind(this);
    this.getFiles = this.getFiles.bind(this);
  }

  setFileRelatedFlags(files) {
    console.log(files ? "yes" : "no");
    // let currentState = Object.assign({},this.state);
    // if (files) {
    //   currentState.fileSelected = true;
    //   currentState.files = files; 
    // } else {
    //   currentState.fileSelected = false;
    // }
    // this.setState({currentState});
    //files ? this.setState({ filesSelected: true, files }) : this.setState({ filesSelected: false });
    if (files) {
      this.setState({ files: files }, () => {
        console.log(files);
      });
    }
    console.log("printing state" + JSON.stringify(this.state));
  }


  getFiles() {
    return this.state.files;
  }


  render() {
    return (
      <div className="App">
        <DisplayLeft setFileRelatedFlags={this.setFileRelatedFlags} />
        <DisplayRight files={this.getFiles} />
      </div>

    );
  }
}

export default App;
