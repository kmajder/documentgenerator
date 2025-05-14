import React, { useEffect, useRef, useState } from 'react'
import { Container, Row, Col, Card, Alert } from 'react-bootstrap'
import { renderAsync } from 'docx-preview'
import './TemplatePage.css'

const TemplatesPage = () => {
  const [templates, setTemplates] = useState([])
  const [error, setError] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const viewerDocument = useRef(null)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch('http://localhost:8000/templates')
        const data = await res.json()
        setTemplates(data)
      } catch (err) {
        setError('Nie udało się załadować szablonów.')
      }
    }

    fetchTemplates()
  }, [])

  const handleTemplateClick = async (filename) => {
    setError('')
    setSelectedTemplate(filename)
    if (viewerDocument.current) viewerDocument.current.innerHTML = ''

    try {
      const res = await fetch(`http://localhost:8000/templates/${filename}`)
      if (!res.ok) throw new Error()

      const arrayBuffer = await res.arrayBuffer()
      await renderAsync(arrayBuffer, viewerDocument.current)
    } catch (err) {
      setError('Błąd podczas ładowania dokumentu.')
    }
  }

  return (
    <Container className="templates-page">
      <h2 className="header">Moje Szablony</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="templates-container">
        {templates.map((tpl) => (
          <Col key={tpl.id || tpl} xs={6} md={3}>
            <Card
              className="template-card"
              onClick={() => handleTemplateClick(tpl.id || tpl)}
            >
              <Card.Body>
                <Card.Title className="template-name">{tpl.name || tpl}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {selectedTemplate && (
        <div className="selected-template-preview-container">
          <h3 className="preview-header">Podgląd: {selectedTemplate}</h3>
          <div className="docx-viewer" ref={viewerDocument}></div>
        </div>
      )}
    </Container>
  )
}

export default TemplatesPage
