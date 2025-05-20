from flask import request, jsonify, send_file
from io import BytesIO
from docxtpl import DocxTemplate
import pandas as pd
import zipfile
import tempfile
from authutils.auth_utils import token_required

@token_required
def generate_documents():
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
        # Wczytaj dane
        data_bytes = data_file.read()
        if data_ext == "csv":
            df = pd.read_csv(BytesIO(data_bytes))
        else:
            df = pd.read_excel(BytesIO(data_bytes))

        records = df.to_dict(orient="records")

        # Stwórz tymczasowy plik ZIP
        zip_buffer = BytesIO()
        with zipfile.ZipFile(zip_buffer, "w") as zipf:
            for idx, record in enumerate(records):
                doc = DocxTemplate(BytesIO(template_file.read()))
                doc.render(record)
                output_buffer = BytesIO()
                doc.save(output_buffer)
                output_buffer.seek(0)
                zipf.writestr(f"document_{idx + 1}.docx", output_buffer.read())
                template_file.seek(0)  # reset pliku po każdej iteracji

        zip_buffer.seek(0)
        return send_file(
            zip_buffer,
            mimetype="application/zip",
            as_attachment=True,
            download_name="generated_documents.zip"
        )

    except Exception as e:
        return jsonify({"error": f"Błąd generowania dokumentów: {str(e)}"}), 500
