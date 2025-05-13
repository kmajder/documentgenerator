import React, { useState } from 'react';
import { BiInfoCircle } from "react-icons/bi";
import ImageUploader from './image-uploader/image-uploader.js';
import './upload-page.css';
import excelImage from './excelExample.png';
import wordImage from './wordExample.png';
const UploadPage = () => {

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

  // Dodaj pliki Excel
  for (const file of excelFiles) {
    formData.append('data_file', file);  // Klucz 'excel_files' w formularzu
  }

  // Dodaj pliki Word
  for (const file of wordFiles) {
    formData.append('template_file', file);  // Klucz 'word_templates' w formularzu
  }

  const endpoint = `http://localhost:8000/generate-docx`;

  try {
    const response = await fetch("http://localhost:8000/generate-docx/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Błąd podczas pobierania pliku");
    }

    const blob = await response.blob(); // <- Pobieramy dane jako Blob (plik)
    const url = window.URL.createObjectURL(blob); // <- Tworzymy URL do pobrania

    const a = document.createElement("a");
    a.href = url;
    a.download = "wygenerowany-plik.zip"; // <- Nazwa zapisywanego pliku
    a.click(); // <- Symulujemy kliknięcie, żeby rozpocząć pobieranie

    window.URL.revokeObjectURL(url); // <- Sprzątamy po sobie

    window.alert("Plik pobrany!");
  } catch (error) {
    console.error("Błąd:", error);
    window.alert("Nie udało się pobrać pliku.");
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

        <div className="tutorial-section">
        <div className="tutorial-steps">
          <div className="step">
            <img src={excelImage} alt="Krok 1 - Excel" />
            <p>1. Wgraj plik Excela z danymi</p>
          </div>
          <div className="step">
            <img src={wordImage} alt="Krok 2 - Word" />
            <p>2. Dodaj swój szablon Word/PDF - kolumny do podstawienia z Excela zamieść między klamrami: {"{{ }}"}</p>
          </div>
          <div className="step">
            <img src={wordImage} alt="Krok 3 - Podsumowanie" />
            <p>3. Sprawdź podsumowanie i wygeneruj dokumenty!</p>
          </div>
        </div>
      </div>

        <main className="upload-main">
          <div>
            <form className="upload-form">

              <div className="upload-input-group">
                <label>Dodaj pliki Excel</label>
                <div className="custom-file-upload" onClick={() => document.getElementById('excelUpload').click()}>
                  ➕
                </div>
                <input
                  type="file"
                  id="excelUpload"
                  accept=".xlsx,.xls"
                  onChange={handleExcelUpload}
                  multiple
                  style={{ display: 'none' }}
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
                <label>Dodaj szablony Word</label>
                <div className="custom-file-upload" onClick={() => document.getElementById('wordUpload').click()}>
                  ➕
                </div>
                <input
                  type="file"
                  id="wordUpload"
                  accept=".docx,.doc"
                  onChange={handleWordUpload}
                  multiple
                  style={{ display: 'none' }}
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
