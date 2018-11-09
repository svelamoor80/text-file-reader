import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import './App.css';

class DisplayLeft extends Component {
  constructor(props) {
    super(props);
    this.state = { files: [], newFile: false };
    this.handleFiles = this.handleFiles.bind(this);

  }
  handleFiles(e) {
    e.preventDefault();
    var files = e.target.files;
    this.setState({ files, newFile: true });
    this.props.setFileRelatedFlags(files, true);
  }
  display(type, e) {
    this.props.display(type);
  }

  render() {
    return (<div className='split left'>
      <div className="centered">
        <input type="file" id="fileElem" onChange={this.handleFiles} />
        <div className="well wellSpacing">
          <Button className="buttonSpacing" bsStyle="primary" onClick={this.display.bind(this, 'original content')}>Display Original File Contents</Button>
          <Button className="buttonSpacing" bsStyle="primary" onClick={this.display.bind(this, 'unique full names')}>List Unique Full Names</Button>
          <Button className="buttonSpacing" bsStyle="primary" onClick={this.display.bind(this, 'unique first names')}>List Unique First Names</Button>
          <Button className="buttonSpacing" bsStyle="primary" onClick={this.display.bind(this, 'unique last names')}>List Unique Last Names</Button>
          <Button className="buttonSpacing" bsStyle="primary" onClick={this.display.bind(this, 'popular first names')}>List Most Populat Top 10 First Names</Button>
          <Button className="buttonSpacing" bsStyle="primary" onClick={this.display.bind(this, 'popular last names')}>List Most Populat Top 10 Last Names</Button>
        </div>

      </div>
    </div >)
  }
}
class DisplayRight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      contentSet: new Set(),
      contentArray: [],
      currentPage: 1,
      itemsPerPage: 1000,
      pageSetSize: 10,
      currentPageSet: 1,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  fetchContents() {
    let receivedFiles = this.props.files();
    if (receivedFiles.length && (this.state.prevFile === null ? true : (receivedFiles[0].name !== this.state.prevFile))) {
      this.setState({ prevFile: receivedFiles[0].name });
      // console.log('right component called')
      return this.resolvePromise(receivedFiles[0])
        .then((result) => {
          this.props.processFileContents(result);
          // this.setState({ content: result });
        })
    }
  }

  resolvePromise(file) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  }

  handleClick(e) {
    this.setState({ currentPage: Number(e.target.id) });
  }

  render() {
    if (this.props.files().length) {
      this.fetchContents(this.props.files);
    }
    if (this.props.content) {
      console.log('items per page' + this.state.itemsPerPage);
      const { currentPage, itemsPerPage, pageSetSize } = this.state;
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItemList = this.props.content.slice(indexOfFirstItem, indexOfLastItem);
      const totalPageSets = Math.ceil(this.props.content.length / (itemsPerPage * pageSetSize));
      console.log('total page sets' + totalPageSets);
      var renderItemList = currentItemList.map((item, index) => {
        // console.log(item);
        return (<li key={index}> {item} </li>)
      })

      const pageSetSizeLength = Math.ceil(this.props.content.length / (itemsPerPage * pageSetSize));
      console.log('pageSetSizeLength' + pageSetSizeLength);
      const pageNumbers = [];

      for (let i = 1; i <= Math.ceil(this.props.content.length / itemsPerPage); i++) {
        pageNumbers.push(i);
      }
      var renderPageNumbers = pageNumbers.map((number) => {
        return (
          <div>

            <li className={number === this.state.currentPage ? "active" : ""} key={number}
              id={number}
              onClick={this.handleClick}>
              {number}
            </li>

          </div>
        )
      })
    }
    return (
      <div className="split right">
        <div className="centered">
          <div className="top">
            {

              // (Array.isArray(this.props.content)) ?
              //   (this.props.content.map((element, index) => {
              //     return <p key={index}>{element}</p>
              //   })) : (this.props.content)
              (Array.isArray(this.props.content)) ?
                (renderItemList) : ""

            }
          </div>
          <div className="bottom">
            <ul id="page-numbers">

              {renderPageNumbers}

            </ul>
          </div>
        </div>
      </div>
    )
  }
}

// function DisplayFile(props) {
//   return (
//     <ul>
//       {Object.keys(props.files).map((key) => {
//         return (<li>{props.files[key].name}</li>);
//       })
//       }
//     </ul>
//   );
// }

function displayUniqueFullNames(content) {
  var newSet = new Set();
  content.forEach(element => {
    newSet.add(element.substring(0, element.indexOf('--')).trim());
  });

  return newSet;
}

function displayUniqueFirstNames(content) {
  var newSet = new Set();
  content.forEach((fullName) => {
    newSet.add(fullName.substring(fullName.indexOf(" "), fullName.indexOf('--')).trim());
  });
  return newSet;
}

function displayUniqueLastNames(content) {
  var newSet = new Set();
  content.forEach((fullName) => {
    newSet.add(fullName.substring(0, fullName.indexOf(',')).trim());
  });
  return newSet;
}
function DisplayBottom() {
  return <div>Pagination</div>
}
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "", files: [], fileContentSet: new Set(), fileContentArray: [], uniqueFullNames: new Set(), originalContent: "", processedContent: ""
    };
    this.setFileRelatedFlags = this.setFileRelatedFlags.bind(this);
    this.processFileContents = this.processFileContents.bind(this);
    this.getFiles = this.getFiles.bind(this);
    this.display = this.display.bind(this);
  }

  setFileRelatedFlags(files, newFile) {
    if (files) {
      this.setState({ files, newFile }, () => {
        console.log(files + newFile);
      });
    }
  }

  processFileContents(content) {
    let processedContent = content.replace(',\s', '\n').split('\n');
    let processedContentArray = processedContent.filter((line) => {
      return (line.indexOf('--') > 0);
    });

    this.setState({ originalContent: processedContentArray, content: processedContent, processedContent: processedContent });
  }


  getFiles() {
    return this.state.files;
  }

  display(type) {
    switch (type) {
      case "original content":
        this.setState({ content: this.state.processedContent });
        break;
      case "unique full names":
        this.setState({ content: [...displayUniqueFullNames(this.state.originalContent)] });
        break;
      case "unique first names":
        this.setState({ content: [...displayUniqueFirstNames(this.state.originalContent)] });
        break;
      case "unique last names":
        console.log('last names case' + this.state.content);
        this.setState({ content: [...displayUniqueLastNames(this.state.originalContent)] });
        break;
      case "popular first names":
        break;
      case "populae last names":
        break;
    }
  }

  render() {
    return (
      <div className="App">
        <DisplayLeft setFileRelatedFlags={this.setFileRelatedFlags} display={this.display} />
        <DisplayRight files={this.getFiles} processFileContents={this.processFileContents} content={this.state.content} />

      </div>

    );
  }
}

export default App;
