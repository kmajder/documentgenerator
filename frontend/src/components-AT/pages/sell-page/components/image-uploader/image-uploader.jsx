import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import './image-uploader.css';

const ImageUploader = ({ images, setImages }) => { 
   
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files); 

        // Iteruj po plikach, konwertuj na base64 i dodaj do stanu
        files.forEach(file => {
            const reader = new FileReader();
            reader.readAsDataURL(file); // Konwertuj na base64
            reader.onloadend = () => {
                setImages((prevImages) => [...prevImages, reader.result]); // Dodaj zakodowany obraz do stanu
            };
        });
    };

    return (
        <div className="form-group image-upload">
            <label htmlFor="images">Dodaj zdjęcia:</label>
            <div className="image-upload-container" onClick={() => document.getElementById('images').click()}>
                <input
                    type="file" // Poprawny typ inputu
                    id="images"
                    accept="image/png, image/jpeg" // Akceptowane typy plików
                    multiple
                    onChange={handleImageChange}
                    className="file-input"
                    style={{ display: 'none' }} // Ukryj przycisk wgrywania plików
                />
                <div className="upload-area">
                    <AiOutlinePlus className="upload-icon" />
                </div>
            </div>
            {/* Wyświetlanie podglądów obrazów */}
            <div className="image-preview-container">
                {images.map((image, index) => (
                    <div key={index} className="image-preview">
                        <img
                            src={image} // Użyj base64 bezpośrednio
                            alt={`preview-${index}`}
                            className="image-thumbnail"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageUploader;
