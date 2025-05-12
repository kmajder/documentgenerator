from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from io import BytesIO
import pandas as pd
from docxtpl import DocxTemplate
from starlette.responses import FileResponse
import zipfile
from starlette.middleware.cors import CORSMiddleware 
import tempfile

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Pozwól na żądania z tego źródła
    allow_credentials=True,
    allow_methods=["*"],  # Pozwól na wszystkie metody (GET, POST, PUT, DELETE, itd.)
    allow_headers=["*"],  # Pozwól na wszystkie nagłówki
)

@app.post("/upload-data/")
async def upload_data(file: UploadFile = File(...)):
    """
    Uploads a data file (CSV or Excel) and returns a preview of the first 5 rows.

    Args:
        file (UploadFile): The uploaded file, which must be either a CSV or an Excel file.

    Returns:
        JSONResponse: A JSON response containing the file contents converted to a list of dictionaries.

    Raises:
        HTTPException: If the file type is invalid or an error occurs during processing.
    """
    if file.content_type not in ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only .xlsx and .csv are supported.")
    
    try:
        content = await file.read()
        if file.content_type == "text/csv":
            df = pd.read_csv(BytesIO(content))
        else:
            df = pd.read_excel(BytesIO(content))
        
        preview = df.to_dict(orient="records")
        return JSONResponse(content=preview)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.post("/generate-docx/")
async def generate_docx(data_file: UploadFile = File(...), template_file: UploadFile = File(...)):
    """
    Generates Word documents for each record in the data file using a template and returns them as a ZIP file.

    Args:
        data_file (UploadFile): The uploaded data file, which must be either a CSV or an Excel file.
        template_file (UploadFile): The uploaded Word template file (.docx).

    Returns:
        FileResponse: A ZIP file containing the generated Word documents.

    Raises:
        HTTPException: If the file types are invalid or an error occurs during document generation.
    """
    if data_file.content_type not in ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"]:
        raise HTTPException(status_code=400, detail="Invalid data file type. Only .xlsx and .csv are supported.")
    if template_file.content_type != "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        raise HTTPException(status_code=400, detail="Invalid template file type. Only .docx is supported.")
    
    try:
        # Read data file
        data_content = await data_file.read()
        if data_file.content_type == "text/csv":
            df = pd.read_csv(BytesIO(data_content))
        else:
            df = pd.read_excel(BytesIO(data_content))
        
        # Convert data to dictionary
        data: list[dict] = df.to_dict(orient="records")
        
        # Load template using tempfile
        with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as temp_template:
            temp_template.write(await template_file.read())
            temp_template_path = temp_template.name
        
        # Create a temporary ZIP file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".zip") as temp_zip:
            zip_path = temp_zip.name
        
        with zipfile.ZipFile(zip_path, 'w') as zipf:
            for idx, record in enumerate(data):
                # Generate a document for each record
                with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as temp_output:
                    doc = DocxTemplate(temp_template_path)
                    doc.render(record)
                    doc.save(temp_output.name)
                    # Add the document to the ZIP file
                    zipf.write(temp_output.name, f"document_{idx + 1}.docx")
        
        return FileResponse(zip_path, media_type="application/zip", filename="generated_documents.zip")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating documents: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
