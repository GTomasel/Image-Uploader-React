import { Component } from 'react'
import './App.css';
import axios from 'axios'

class App extends Component {
  state = {
    selectedFile: null
  }

  selectedFileHandler = event => {
    this.setState({
      selectedFile: event.target.files[0]
    })
  }

  fileUploadHandler = () => {
    const fd = new FormData()
    fd.append('image', this.state.selectedFile, this.state.selectedFile.name)
    axios.post('', fd, {
      onUploadProgress: progressEvent => {
        console.log(`Upload progress ${Math.round(progressEvent.loaded / progressEvent.total * 100)}%`)
      }
    })
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <input style={{ display: 'none' }} type="file" onChange={this.selectedFileHandler} ref={fileInput => this.fileInput = fileInput} />
          <button onClick={() => this.fileInput.click()}>Select file</button>
          <button onClick={this.fileUploadHandler}>Upload</button>
        </header> 
      </div>
    );
  }
}

export default App;
