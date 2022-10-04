import './App.css';
import { storage } from './firebase'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { useState, useEffect, useRef } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Toaster, toast } from 'react-hot-toast'
import { v4 } from 'uuid'
import { useDropzone } from 'react-dropzone'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [uploadedImageURL, setUploadedImageURL] = useState(null)
  const [uploading, setUploading] = useState(false)

  //////////////////////////////////////// Drag & Drop ////////////////////////////////////////

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg','.jpeg'],
      'image/png': ['.png'],
      'image/bmp': ['.bmp'],
      'image/gif': ['.gif'],
      'image/tiff': ['.tif','.tiff'],
      'image/webp': ['.webp']
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      setSelectedImage(acceptedFiles[0])
    }
  })

  const inputFile = useRef(null)


  //////////////////////////////////////// Upload file ////////////////////////////////////////

  useEffect(() => {
    if (selectedImage == null) return

    if (selectedImage.type.split('/')[0] !== "image"){
      toast.error('Invalid file type')
      return
    }

    setUploadedImageURL(null)
    setUploading(true)
    const imageRef = ref(storage, `images/${selectedImage.name}-${v4()}`)
    uploadBytesResumable(imageRef, selectedImage).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setUploadedImageURL(url)
        setSelectedImage(null)
        setUploading(false)
      })
    })
      .catch((error) => {
        console.log(error)
      })
  }, [selectedImage])


  return (
    <div className="App">
      <header className="App-header">

        <Toaster toastOptions={{
          className: 'toastNotification'
        }} />

        <div className="uploadCard">

          {!uploadedImageURL &&
            <>
              <p className="title">Upload your image</p>
              <p className="subTitle">File should be Jpeg, Png,...</p>

              {!uploading &&
                <div {...getRootProps()} className="fileSelectBox" onClick={() => inputFile.current.click()}>
                  <p className="mt-4">Drag &amp; Drop your image here</p>
                  <input {...getInputProps()} />
                </div>
              }

              {uploading &&
                <div className="imgPreview">
                  <div className="loader"></div>
                </div>
              }

              <p className="mt-2">Or</p>
              <button className="mt-2 mb-3 btn btn-primary" onClick={() => inputFile.current.click()}>Select file</button>
            </>
          }

          {uploadedImageURL &&
            <>
              <p className="title">Upload successful! ✅</p>
              <div {...getRootProps()} className="imgPreview mb-3" onClick={() => null}>
                <img src={uploadedImageURL} alt="preview" />
                <CopyToClipboard text={uploadedImageURL}>
                  <button className="mt-2 btn btn-light" onClick={() => toast.success('Copied to clipboard!')}>Copy link 📄</button>
                </CopyToClipboard>
                <input {...getInputProps()} />
              </div>
              <button className="mt-2 mb-3 btn btn-primary" onClick={() => inputFile.current.click()}>Upload more</button>
            </>
          }

          <input style={{ display: 'none' }} type="file" accept=".jpg, .jpeg, .bmp, .png, .tiff, .tif, .gif, .webp" onChange={(event) => {
            setSelectedImage(event.target.files[0]);
          }} ref={inputFile} />
        </div>
        <span className="text-secondary mb-1 align-self-end">Created by Gabriel Tomasel 2022</span>
      </header>
    </div>
  );
}


export default App;
