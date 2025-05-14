import React, { useEffect, useState } from "react";
import "./TemplatePage.css"; // Importujemy plik CSS

const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      // Tu wstaw statyczne dane lub zahardcoduj
      const templatesData = [
        { id: 1, name: "wygenerowany-plik.docx", type: "docx" },
        { id: 2, name: "Template 2", type: "pdf" },
        { id: 3, name: "Template 3", type: "xls" },
      ];
      setTemplates(templatesData);
    };

    fetchTemplates();
  }, []);

  const handlePreview = (template) => {
    setSelectedTemplate(template);
  };

  return (
    <div className="templates-page">
      <h1 className="header">Moje szablony</h1>

      {/* Siatka dla plików */}
      <div className="templates-container">
        {templates.map((template) => (
          <div
            key={template.id}
            className="template-card"
            onClick={() => handlePreview(template)}
          >
            {/* Nazwa pliku */}
            <p className="template-name">{template.name}</p>

            {/* Podgląd pliku */}
            <iframe
              src={`http://localhost:8000/templates/${template.id}/preview`} 
              title={`Podgląd ${template.name}`}
              className="template-preview"
            ></iframe>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div>
          <h2 className="preview-header">Podgląd: {selectedTemplate.name}</h2>
          <iframe
            src={`http://localhost:8000/templates/${selectedTemplate.id}/preview`} 
            title="Podgląd szablonu"
            className="selected-template-preview"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
