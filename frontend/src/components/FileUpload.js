// src/components/FileUpload.js
import React, { useState } from 'react';

const FileUpload = ({ onFileChange }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    onFileChange(selectedFile);  // Przekazanie pliku do App.js
  };

  return (
    <div>
      <label htmlFor="file-upload">Wybierz plik Excel:</label>
      <input 
        type="file" 
        id="file-upload" 
        accept=".xlsx,.xls"
        onChange={handleFileChange} 
      />
      {file && <p>Załadowano plik: {file.name}</p>}
    </div>
  );
};

export default FileUpload;
