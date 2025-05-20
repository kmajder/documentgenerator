from flask import Blueprint
from document_generator_new.generate_documents import generate_documents

documents_bp = Blueprint("documents", __name__)

@documents_bp.route("/generate_docx", methods=["POST"])
def generate_documents_service():
    return generate_documents()
