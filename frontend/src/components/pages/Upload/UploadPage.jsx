import React, { useState } from 'react';
import { BiInfoCircle } from "react-icons/bi";
import ImageUploader from './image-uploader/image-uploader.js';
import './upload-page.css';

const UploadPage = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [technique, setTechnique] = useState('');
  const [style, setStyle] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [year, setYear] = useState('');
  const [images, setImages] = useState([]);

  const [excelFiles, setExcelFiles] = useState([]);
  const [wordFiles, setWordFiles] = useState([]);

  const handleExcelUpload = (event) => {
    const files = Array.from(event.target.files);
    setExcelFiles((prev) => [...prev, ...files]);
  };

  const removeExcelFile = (index) => {
    setExcelFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleWordUpload = (event) => {
    const files = Array.from(event.target.files);
    setWordFiles((prev) => [...prev, ...files]);
  };

  const removeWordFile = (index) => {
    setWordFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    for (const image of images) {
      formData.append('files', image);
    }

    for (const file of excelFiles) {
      formData.append('excel_files', file);
    }

    for (const file of wordFiles) {
      formData.append('word_templates', file);
    }

    const endpoint = `http://localhost:8000/offers/?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&price=${encodeURIComponent(price)}&description=${encodeURIComponent(description)}&technique=${encodeURIComponent(technique)}&style=${encodeURIComponent(style)}&width=${encodeURIComponent(width)}&height=${encodeURIComponent(height)}&year_created=${encodeURIComponent(year)}`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("OK");
        window.alert('Wysłane!');
      } else {
        console.log("Not ok");
        window.alert('Coś poszło nie tak');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div
        className="upload-background"
        style={{ backgroundImage: 'url("src/components/pages/main-page/painting-background-abstract.jpg")' }}
      ></div>

      <div className="upload-container">
        <header className="upload-header">
          <h1>Wygeneruj dokumenty!</h1>
        </header>

        <main className="upload-main">
          <div>
            <form className="upload-form">

              <div className="upload-input-group">
                <label htmlFor="excelUpload">Plik Excel (.xlsx / .xls)</label>
                <input
                  type="file"
                  id="excelUpload"
                  accept=".xlsx,.xls"
                  onChange={handleExcelUpload}
                  multiple
                />
              </div>

              {excelFiles.length > 0 && (
                <div className="excel-file-list">
                  {excelFiles.map((file, index) => (
                    <div key={index} className="excel-file-item">
                      <span>{file.name}</span>
                      <button
                        type="button"
                        className="remove-excel-button"
                        onClick={() => removeExcelFile(index)}
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="upload-input-group">
                <label htmlFor="wordUpload">Szablony Word (.docx / .doc)</label>
                <input
                  type="file"
                  id="wordUpload"
                  accept=".docx,.doc"
                  onChange={handleWordUpload}
                  multiple
                />
              </div>

              {wordFiles.length > 0 && (
                <div className="word-file-list">
                  {wordFiles.map((file, index) => (
                    <div key={index} className="word-file-item">
                      <span>{file.name}</span>
                      <button
                        type="button"
                        className="remove-word-button"
                        onClick={() => removeWordFile(index)}
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button type="button" className="upload-button" onClick={handleSubmit}>
                Wygeneruj!
              </button>
            </form>
          </div>
        </main>
      </div>
    </>
  );
};

export default UploadPage;
