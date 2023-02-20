import { useState } from "react"
import styles from './app.module.css';
import { XCircle } from "phosphor-react";
import { api } from "./services/api";

function App() {
  const [images, setImages] = useState([]);
  const [imagesToRemove, setImageToRemove] = useState(null);

  function handleRemoveImg(imgObj) {
    setImageToRemove(imgObj);

    api.delete(`/remove-image/${imgObj.public_id}`)
      .then(() => {
        setImageToRemove(null);

        setImages(prev => prev.filter(img => {
          return img.public_id !== imgObj.public_id;
        }));
      })
      .catch(e => console.log(e));
  }

  function handleOpenWidget() {
    var myWidget = window.cloudinary.createUploadWidget({
      cloudName: 'dbykacisp',
      uploadPreset: 'yxqvd6o7'
    }, (error, result) => {
      if (!error && result && result.event === "success") {
        setImages((prev) => [...prev, {
          url: result.info.url,
          public_id: result.info.public_id
        }]);
      }
    }
    );

    // open widget
    myWidget.open();
  }

  return (
    <div>
      <button
        id="upload-widget"
        className="cloudinary-button"
        onClick={() => handleOpenWidget()}
      >
        Upload pictures
      </button>

      <div className={styles.imagesPreviewContainer}>
        {images.map((image) => (
          <div className={styles.imagePreview}>
            <XCircle 
              className={styles.closeButton}
              size={32}
              weight="bold"
              onClick={() => handleRemoveImg(image)} 
            />
            <img src={image.url} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
