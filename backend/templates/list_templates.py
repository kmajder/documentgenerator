from flask import jsonify, request, current_app as app
from extensions import s3_client
from config import Config
from authutils.auth_utils import token_required 

BUCKET_NAME = Config.S3_TEMPLATES_BUCKET_NAME

@token_required
def list_templates():
    user_id = request.user.get("user_id")
    user_email = request.user.get("email")

    if not user_id or not user_email:
        return jsonify({"error": "Brak danych użytkownika"}), 400

    prefix = f"{user_email}-{user_id}/"

    try:
        response = s3_client.list_objects_v2(Bucket=BUCKET_NAME, Prefix=prefix)
        contents = response.get("Contents", [])

        templates = [
            {
                "filename": obj["Key"].split("/")[-1],
                "key": obj["Key"]
            }
            for obj in contents
            if obj["Key"].lower().endswith(".docx")  # Usunięto sprawdzanie PDF
        ]

        return jsonify({"templates": templates})

    except Exception as e:
        app.logger.error(f"Błąd podczas listowania szablonów z S3: {e}")
        return jsonify({"error": "Błąd przy pobieraniu listy szablonów"}), 500