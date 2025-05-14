from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# CORS — pozwól frontendowi się łączyć
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # zmień na konkretny adres frontendu jeśli trzeba
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMPLATE_DIR = "templates"

@app.get("/templates")
def list_templates():
    try:
        files = [f for f in os.listdir(TEMPLATE_DIR) if f.endswith(".docx")]
        return [{"name": f, "id": f} for f in files]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/templates/{filename}")
def get_template(filename: str):
    filepath = os.path.join(TEMPLATE_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(filepath, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")

