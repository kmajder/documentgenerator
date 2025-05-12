// src/components/FileFormat.js
import React from 'react';

const FileFormat = ({ onFormatChange }) => {
  return (
    <div>
      <label htmlFor="file-format">Wybierz format pliku:</label>
      <select id="file-format" onChange={(e) => onFormatChange(e.target.value)}>
        <option value="word">Word</option>
        <option value="pdf">PDF</option>
      </select>
    </div>
  );
};

export default FileFormat;
