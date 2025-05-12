# Document Generator Backend

This is a FastAPI-based backend for generating Word documents from a data file (CSV or Excel) and a Word template. The generated documents are returned as a ZIP file.

## Features
- **Upload Data**: Upload a CSV or Excel file.
- **Generate Documents**: Generate Word documents for each record in the data file using a provided Word template.

## Endpoints

### 1. `/upload-data/` (POST)
- **Description**: Upload a data file and preview its contents.
- **Request**:
  - `file`: CSV or Excel file (`.csv` or `.xlsx`).
- **Response**: List of dictionaries containing each row's contents.

### 2. `/generate-docx/` (POST)
- **Description**: Generate Word documents for each record in the data file using a Word template.
- **Request**:
  - `data_file`: CSV or Excel file (`.csv` or `.xlsx`).
  - `template_file`: Word template file (`.docx`).
- **Response**: A ZIP file containing the generated Word documents.

## Running Locally

### Prerequisites
- Python 3.10+
- ... or Docker

### Steps
1. `docker build -t documentgenerator-backend .`
2. `docker run -p 8000:8000 documentgenerator-backend`
3. `Visit localhost:8000/docs` to conveniently test the API