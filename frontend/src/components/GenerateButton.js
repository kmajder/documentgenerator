// src/components/GenerateButton.js
import React from 'react';

const GenerateButton = ({ onGenerate }) => {
  return (
    <div>
      <button onClick={onGenerate}>Generuj dokumenty</button>
    </div>
  );
};

export default GenerateButton;
