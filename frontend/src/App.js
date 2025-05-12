// src/App.js
import React, { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import FileFormat from './components/FileFormat';
import './App.css';
import GenerateButton from './components/GenerateButton';
import Home from './components/pages/MainPage/Home.jsx'
import Nav from './components/Navbar/Navbar.jsx'


const App = () => {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('word');  // domyślnie Word

  const handleFileChange = (file) => {
    setFile(file);
  };

  const handleFormatChange = (format) => {
    setFormat(format);
  };

  const handleGenerate = () => {
    if (!file) {
      alert('Proszę załadować plik!');
      return;
    }
    alert(`Generowanie dokumentów w formacie ${format}`);
    // Tutaj dodaj logikę do generowania dokumentów
  };

  return (
    <div>
      <Home>
        
      </Home>
    </div>
  );
};

export default App;
