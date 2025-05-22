import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import './upload-page.css';
import excelImage from './excelExample.png';
import wordImage from './wordExample.png';
import { renderAsync } from 'docx-preview';
import JSZip from 'jszip';
import api from '../../Interceptor/api'; // Zaimportuj swój interceptor

const UploadPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [excelFiles, setExcelFiles] = useState([]);
  const [wordFiles, setWordFiles] = useState([]);
  const [availableTemplates, setAvailableTemplates] = useState([]);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState('');
  const [previewDocuments, setPreviewDocuments] = useState([]);
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState(null);
  const [error, setError] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const viewerRef = useRef(null);

  const handlePreview = async () => {
    if (excelFiles.length === 0) {
      setError("Dodaj plik Excela z danymi");
      return;
    }

    let templateFile = wordFiles[0];
    
    if (selectedTemplateKey && wordFiles.length === 0) {
      try {
        const response = await api.get(`/templates/get_template/${encodeURIComponent(selectedTemplateKey)}`, {
          responseType: 'blob'
        });

        const blob = response.data;
        const filename = selectedTemplateKey.split('/').pop();
        templateFile = new File([blob], filename, { type: blob.type });
      } catch (err) {
        console.error("Błąd pobierania szablonu:", err);
        setError("Nie udało się pobrać szablonu.");
        return;
      }
    } else if (wordFiles.length === 0) {
      setError("Dodaj szablon Word lub wybierz z listy");
      return;
    }

    setIsPreviewLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("data_file", excelFiles[0]);
    formData.append("template_file", templateFile);

    try {
      const response = await api.post("/documents/preview-docx", formData, {
        responseType: "arraybuffer"
      });

      const zip = await JSZip.loadAsync(response.data);
      const docs = [];

      for (const [filename, file] of Object.entries(zip.files)) {
        if (filename.endsWith('.docx')) {
          const content = await file.async('arraybuffer');
          docs.push({
            name: filename,
            content: content
          });
        }
      }

      setPreviewDocuments(docs);
      if (docs.length > 0) {
        setSelectedPreviewDoc(0);
        setShowPreview(true);
      }
    } catch (err) {
      console.error(err);
      setError("Błąd podczas podglądu dokumentu.");
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const renderSelectedDocument = async () => {
    if (selectedPreviewDoc !== null && previewDocuments[selectedPreviewDoc]) {
      viewerRef.current.innerHTML = "";
      await renderAsync(previewDocuments[selectedPreviewDoc].content, viewerRef.current);
    }
  };

  useEffect(() => {
    if (showPreview) {
      renderSelectedDocument();
    }
  }, [selectedPreviewDoc, showPreview]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await api.get('/templates/get_templates');
        setAvailableTemplates(res.data.templates || []);
      } catch (err) {
        console.error("Błąd pobierania szablonów:", err);
      }
    };

    fetchTemplates();
  }, []);

  const handleExcelUpload = async (event) => {
    const files = Array.from(event.target.files);
    setExcelFiles((prev) => [...prev, ...files]);
    event.target.value = '';
  };

  const handleWordUpload = (event) => {
    const files = Array.from(event.target.files);
    setWordFiles((prev) => [...prev, ...files]);
    event.target.value = '';
  };

  const removeExcelFile = (index) => {
    setExcelFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeWordFile = (index) => {
    setWordFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    for (const file of excelFiles) {
      formData.append('data_file', file);
    }

    if (selectedTemplateKey) {
      try {
        const response = await api.get(`/templates/get_template/${encodeURIComponent(selectedTemplateKey)}`, {
          responseType: 'blob'
        });

        const blob = response.data;
        const filename = selectedTemplateKey.split('/').pop();
        const file = new File([blob], filename, { type: blob.type });
        formData.append('template_file', file);
      } catch (err) {
        console.error("Błąd pobierania szablonu:", err);
        alert("Nie udało się pobrać szablonu.");
        return;
      }
    }

    for (const file of wordFiles) {
      formData.append('template_file', file);
    }

    try {
      const response = await api.post("/documents/generate_docx", formData, {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "wygenerowany-plik.zip";
      a.click();
      window.URL.revokeObjectURL(url);
      alert("Plik pobrany!");
    } catch (error) {
      console.error("Błąd:", error);
      alert("Nie udało się pobrać pliku.");
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
              <p>2. Dodaj swój szablon Word/PDF – użyj {"{{ }}"}</p>
            </div>
            <div className="step">
              <img src={wordImage} alt="Krok 3 - Podsumowanie" />
              <p>3. Wygeneruj dokumenty!</p>
            </div>
          </div>
        </div>

        <main className="upload-main">
          <form className="upload-form" onSubmit={handleSubmit}>
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
                    <button type="button" onClick={() => removeExcelFile(index)}>❌</button>
                  </div>
                ))}
              </div>
            )}

            <div className="upload-input-group">
              <label>Wybierz szablon Word z bazy lub dodaj własny</label>
              <select
                className="template-select"
                value={selectedTemplateKey}
                onChange={(e) => setSelectedTemplateKey(e.target.value)}
              >
                <option value="">-- Wybierz z dostępnych --</option>
                {availableTemplates.map((tpl) => (
                  <option key={tpl.key} value={tpl.key}>
                    {tpl.filename}
                  </option>
                ))}
              </select>

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
                    <button type="button" onClick={() => removeWordFile(index)}>❌</button>
                  </div>
                ))}
              </div>
            )}

            <div className="action-buttons">
              <button 
                type="button" 
                className="upload-button"
                onClick={handlePreview}
                disabled={isPreviewLoading}
              >
                {isPreviewLoading ? 'Ładowanie podglądu...' : 'Podgląd'}
              </button>

              {user ? (
                <button type="submit" className="upload-button">Wygeneruj i pobierz!</button>
              ) : (
                <button type="button" className="upload-button" onClick={() => navigate('/login')}>
                  Zaloguj się żeby wygenerować!
                </button>
              )}
            </div>

            {error && <p className="error-message">{error}</p>}
          </form>

          {showPreview && previewDocuments.length > 0 && (
            <div className="preview-section">
              <h3>Podgląd dokumentów</h3>
              
              <div className="document-selector">
                <label>Wybierz dokument do podglądu:</label>
                <select
                  value={selectedPreviewDoc || ''}
                  onChange={(e) => setSelectedPreviewDoc(parseInt(e.target.value))}
                >
                  {previewDocuments.map((doc, index) => (
                    <option key={index} value={index}>
                      {doc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div 
                ref={viewerRef} 
                className="docx-viewer"
              />
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default UploadPage;