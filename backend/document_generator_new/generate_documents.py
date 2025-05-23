from flask import request, jsonify, send_file
from io import BytesIO
from docxtpl import DocxTemplate
import pandas as pd
import zipfile
from authutils.auth_utils import token_required
from extensions import mongo
from bson import ObjectId
from docx import Document
from docx.opc.exceptions import PackageNotFoundError
from config import Config

@token_required
def generate_documents():
    # Sprawdź limit dokumentów
    user_id = request.user.get("user_id")
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        return jsonify({"error": "Użytkownik nie istnieje"}), 404

    plan = mongo.db.plans.find_one({"name": user.get("plan", Config.DEFAULT_PLAN)})
    if not plan:
        return jsonify({"error": "Plan użytkownika nie znaleziony"}), 400

    max_docs = plan.get("max_documents_per_month", 0)
    if user.get("doc_count", 0) >= max_docs:
        return jsonify({"error": "Przekroczono limit dokumentów dla Twojego planu"}), 403

    # Walidacja plików
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
        # Wczytaj i zweryfikuj szablon
        template_bytes = template_file.read()
        try:
            Document(BytesIO(template_bytes))  # Weryfikacja struktury DOCX
        except PackageNotFoundError:
            return jsonify({"error": "Nieprawidłowy plik szablonu DOCX"}), 400

        # Wczytaj dane
        data_bytes = data_file.read()
        if data_ext == "csv":
            df = pd.read_csv(BytesIO(data_bytes))
        else:
            df = pd.read_excel(BytesIO(data_bytes))

        if df.empty:
            return jsonify({"error": "Plik danych jest pusty"}), 400
            
        records = df.to_dict(orient="records")
        if len(records) == 0:
            return jsonify({"error": "Brak danych do generacji"}), 400

        # Generuj dokumenty
        zip_buffer = BytesIO()
        with zipfile.ZipFile(zip_buffer, "w") as zipf:
            for idx, record in enumerate(records):
                try:
                    doc = DocxTemplate(BytesIO(template_bytes))  # Użyj zapisanego szablonu
                    doc.render(record)
                    output_buffer = BytesIO()
                    doc.save(output_buffer)
                    output_buffer.seek(0)
                    zipf.writestr(f"document_{idx + 1}.docx", output_buffer.getvalue())
                except Exception as e:
                    return jsonify({
                        "error": f"Błąd generowania dokumentu {idx+1}: {str(e)}"
                    }), 500

        # Aktualizuj licznik
        mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$inc": {"doc_count": len(records)}}
        )

        zip_buffer.seek(0)
        return send_file(
            zip_buffer,
            mimetype="application/zip",
            as_attachment=True,
            download_name="generated_documents.zip"
        )

    except pd.errors.EmptyDataError:
        return jsonify({"error": "Plik danych jest pusty"}), 400
    except pd.errors.ParserError as pe:
        return jsonify({"error": f"Błąd parsowania danych: {str(pe)}"}), 400
    except Exception as e:
        return jsonify({"error": f"Krytyczny błąd generowania: {str(e)}"}), 500