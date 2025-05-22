from flask import Blueprint
from document_generator_new.generate_documents import generate_documents
from document_generator_new.preview_docx import preview_docx_service
#from document_generator_new.preview_excel import preview_excel

documents_bp = Blueprint("documents", __name__)

@documents_bp.route("/generate_docx", methods=["POST"])
def generate_documents_service():
    return generate_documents()


@documents_bp.route("/preview-docx", methods=["POST"])
def preview_docx():
    return preview_docx_service()


