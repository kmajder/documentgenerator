<div className="form-group image-upload ">
<label htmlFor="images">Dodaj zdjęcia:</label>
<div className="image-upload-container">
  <input
    type="file"
    id="images"
    multiple
    onChange={handleImageChange}
    className="file-input"
  />
  <div className="upload-area">
    <AiOutlinePlus className="upload-icon" />
  </div>
</div>
{/* Display image previews */}
<div className="image-preview-container">
  {images.map((image, index) => (
    <div key={index} className="image-preview">
      <img
        src={URL.createObjectURL(image)}
        alt={preview-${index}}
        className="image-thumbnail"
      />
    </div>
  ))}
</div>
</div>
