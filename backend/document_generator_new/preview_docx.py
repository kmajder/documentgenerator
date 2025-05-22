from flask import request, send_file, jsonify
from io import BytesIO
from docxtpl import DocxTemplate
import pandas as pd
import zipfile
from authutils.auth_utils import token_required

def preview_docx_service():
    if "data_file" not in request.files or "template_file" not in request.files:
        return jsonify({"error": "Brak pliku danych lub szablonu"}), 400

    data_file = request.files["data_file"]
    template_file = request.files["template_file"]

    data_ext = data_file.filename.rsplit(".", 1)[-1].lower()
    template_ext = template_file.filename.rsplit(".", 1)[-1].lower()

    if data_ext not in {"csv", "xlsx"}:
        return jsonify({"error": "Nieprawidłowy format danych. Wymagany .csv lub .xlsx"}), 400

    if template_ext != "docx":
        return jsonify({"error": "Nieprawidłowy format szablonu. Wymagany .docx"}), 400

    try:
        data_bytes = data_file.read()
        if data_ext == "csv":
            df = pd.read_csv(BytesIO(data_bytes))
        else:
            df = pd.read_excel(BytesIO(data_bytes))

        records = df.to_dict(orient="records")

        if not records:
            return jsonify({"error": "Brak danych do wypełnienia dokumentu."}), 400

        template_file_bytes = template_file.read()
        
        # Tworzymy bufor ZIP dla wszystkich dokumentów
        zip_buffer = BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for i, record in enumerate(records[:10]):  # Ogranicz do 10 dokumentów dla podglądu
                doc = DocxTemplate(BytesIO(template_file_bytes))
                doc.render(record)
                doc_buffer = BytesIO()
                doc.save(doc_buffer)
                doc_buffer.seek(0)
                zip_file.writestr(f"document_{i+1}.docx", doc_buffer.getvalue())

        zip_buffer.seek(0)
        
        # Zwracamy ZIP z dokumentami
        return send_file(
            zip_buffer,
            as_attachment=False,
            download_name="preview_documents.zip",
            mimetype="application/zip"
        )

    except Exception as e:
        return jsonify({"error": f"Błąd generowania dokumentu: {str(e)}"}), 500