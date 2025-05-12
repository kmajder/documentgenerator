import React, { useRef } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { FaTimes } from "react-icons/fa";

const ImageUploader = ({ images, setImages }) => { 
    const dragImage = useRef(null);
    const dragOverImage = useRef(null);
    
    const generateUniqueId = () => {
        return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    };

    const handleSort = () => {
        const imageClone = [...images];
        const draggedImage = imageClone[dragImage.current];
        imageClone.splice(dragImage.current, 1);
        imageClone.splice(dragOverImage.current, 0, draggedImage);
        setImages(imageClone);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files); 
        files.forEach(file => {
            setImages((prevImages) => [...prevImages, file]);
        });
    };
    
    const removeImage = (index) => {
        setImages([
                ...images.slice(0, index),
                ...images.slice(index + 1)
        ]);
    };

    return (
        <div className="form-group">
            <label htmlFor="images" >Dodaj pliki excel:</label>
            <div 
                className="flex flex-col items-center justify-center mt-2 border-2 border-dashed border-gray-300 p-5 cursor-pointer w-full max-w-full"
                onClick={() => document.getElementById('images').click()}
            >
                <input
                    type="file" 
                    id="images"
                    accept="image/png, image/jpeg"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                />
                <div className="text-center">
                    <AiOutlinePlus className="text-5xl text-gray-400" />
                </div>
            </div>
            <div className="flex flex-wrap mt-4">
                {images.map((image, index) => (
                    <div
                        className="relative w-36 h-36 m-2 border border-gray-300"
                        key={generateUniqueId()}
                        draggable
                        onDragStart={() => (dragImage.current = index)}
                        onDragEnter={() => (dragOverImage.current = index)}
                        onDragEnd={handleSort}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <img src={URL.createObjectURL(image)} alt={`preview-${index}`} className="w-full h-full object-cover" />
                        <button
                            className="absolute top-2 right-2 bg-gray-700 text-white text-sm p-1 rounded hover:bg-gray-600"
                            onClick={() => removeImage(index)}
                        >
                            <FaTimes />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageUploader;
