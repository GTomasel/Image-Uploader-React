import './App.css';
import { storage } from './firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useState, useRef } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Toaster, toast } from 'react-hot-toast'
import { v4 } from 'uuid'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [uploadedImageURL, setUploadedImageURL] = useState(null)

  const inputFile = useRef(null)

  const uploadImage = () => {
    if (selectedImage == null) return
    const imageRef = ref(storage, `images/${selectedImage.name}-${v4()}`)
    uploadBytes(imageRef, selectedImage).then((snapshot) => {
      console.log('Upload complete')
      getDownloadURL(snapshot.ref).then((url) => {
        setUploadedImageURL(url)
      })

    })
  }


  return (
    <div className="App">
      <header className="App-header">

        {uploadedImageURL &&
          <>
            <img src={uploadedImageURL} alt="File visualization" />
            <CopyToClipboard text={uploadedImageURL}>
              <button onClick={() => toast.success('Copied to clipboard!')}>Copiar enlace</button>
            </CopyToClipboard>
          </>
        }

        <Toaster toastOptions={{
          className: 'toastNotification'
        }} />


        <div className="uploadCard">
          <p className="title">Upload your image</p>
          <p className="subTitle">File should be Jpeg, Png,...</p>
          <div className="fileSelectBox" onClick={() => inputFile.current.click()}>
            <p>Drag &amp; Drop your image here</p>
          </div>
          <p className="subTitle">Or</p>

          <input style={{display: 'none'}} type="file" onChange={(event) => {
            setSelectedImage(event.target.files[0])
          }} ref={inputFile} />
          <button onClick={() => inputFile.current.click()}>Select file</button>
          <button onClick={uploadImage}>Upload</button>

        </div>


      </header>
    </div>
  );
}


export default App;
