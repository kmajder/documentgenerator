import React, { useEffect, useRef, useState } from 'react'
import { Container, Row, Col, Card, Alert, Form, Button } from 'react-bootstrap'
import { renderAsync } from 'docx-preview'
import './TemplatePage.css'
import api from '../../Interceptor/api'

const TemplatesPage = () => {
  const [templates, setTemplates] = useState([])
  const [error, setError] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [uploading, setUploading] = useState(false)
  const viewerDocument = useRef(null)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const res = await api.get('/templates/get_templates');
      const data = res.data;
      setTemplates(data.templates || []);
    } catch (err) {
      console.error('Błąd ładowania szablonów:', err);
      setError('Nie udało się załadować szablonów.');
    }
  };

  const handleTemplateClick = async (key) => {
    setError('')
    setSelectedTemplate(key)
    if (viewerDocument.current) viewerDocument.current.innerHTML = ''

    try {
      const response = await api.get(`/templates/get_template/${encodeURIComponent(key)}`, {
        responseType: 'arraybuffer'
      });

      const arrayBuffer = response.data;
      await renderAsync(arrayBuffer, viewerDocument.current);
    } catch (err) {
      setError('Błąd podczas ładowania dokumentu.');
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    const file = e.target.file.files[0]
    if (!file) return

    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('http://localhost:5000/templates/create_template', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload error')

      fetchTemplates()
    } catch (err) {
      setError(err.message || 'Błąd podczas przesyłania pliku.')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteTemplate = async (key) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten szablon?')) return

    try {
      const res = await fetch(`http://localhost:5000/templates/remove_template/${encodeURIComponent(key)}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!res.ok) throw new Error('Nie udało się usunąć szablonu.')

      if (selectedTemplate === key) {
        setSelectedTemplate(null)
        if (viewerDocument.current) viewerDocument.current.innerHTML = ''
      }

      fetchTemplates()
    } catch (err) {
      setError('Błąd podczas usuwania szablonu.')
    }
  }

  return (
    <Container className="templates-page">
      <h2 className="header">Moje Szablony</h2>

      <Form onSubmit={handleUpload} className="mb-4">
        <Form.Group controlId="file">
          <Form.Label>Dodaj szablon Word (DOCX)</Form.Label>
          <Form.Control type="file" accept=".docx" required />
        </Form.Group>
        <Button type="submit" className="addTemplateButton" disabled={uploading}>
          {uploading ? 'Wysyłanie...' : 'Dodaj szablon'}
        </Button>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="templates-container">
        {templates.map((tpl) => (
          <Col key={tpl.key} xs={12} sm={6} md={4} lg={3}>
            <Card className="template-card">
              <Card.Body>
                <Card.Title className="template-name" onClick={() => handleTemplateClick(tpl.key)}>
                  {tpl.filename}
                </Card.Title>
                <Button
                  variant="danger"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleDeleteTemplate(tpl.key)}
                >
                  Usuń
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {selectedTemplate && (
        <div className="selected-template-preview-container">
          <h3 className="preview-header">Podgląd: {selectedTemplate.split('/').pop()}</h3>
          <div className="docx-viewer" ref={viewerDocument}></div>
        </div>
      )}
    </Container>
  )
}

export default TemplatesPage