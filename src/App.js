import './App.css';
import { storage } from './firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useState } from 'react'
import { v4 } from 'uuid'

function App() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [uploadedImage, setUploadedImage] = useState(null)

  const uploadImage = () => {
    if (selectedImage == null) return
    const imageRef = ref(storage, `images/${selectedImage.name}-${v4()}`)
    uploadBytes(imageRef, selectedImage).then((snapshot) => {
      console.log('Upload complete')
      getDownloadURL(snapshot.ref).then((url) => {
        setUploadedImage(url)
      })

    })
  }


  return (
    <div className="App">
      <header className="App-header">
        <input type="file" onChange={(event) => {
          setSelectedImage(event.target.files[0])
        }} />

        <button onClick={uploadImage}>Upload</button>

        <img src={uploadedImage} alt="New file"/>
      </header>
    </div>
  );
}


export default App;
