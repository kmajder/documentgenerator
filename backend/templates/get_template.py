from flask import Blueprint, request, jsonify, current_app as app
from flask import send_file, make_response
from werkzeug.utils import secure_filename
from extensions import s3_client, mongo
from bson import ObjectId
from config import Config
from authutils.auth_utils import token_required 

@token_required
def get_template(key):
    user_id = request.user.get("user_id")
    user_email = request.user.get("email")

    if not user_id or not user_email:
        return jsonify({"error": "Brak danych użytkownika"}), 400

    prefix = f"{user_email}-{user_id}/"
    if not key.startswith(prefix):
        return jsonify({"error": "Nie masz dostępu do tego pliku"}), 403

    try:
        s3_object = s3_client.get_object(Bucket=Config.S3_TEMPLATES_BUCKET_NAME, Key=key)
        file_data = s3_object["Body"].read()
        filename = key.split("/")[-1]

        response = make_response(file_data)
        response.headers.set("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
        response.headers.set("Content-Disposition", f'inline; filename="{filename}"')
        response.headers.set("Access-Control-Allow-Origin", "http://localhost:3000")  # lub ogranicz do domeny frontendu
        response.headers.set("Access-Control-Allow-Credentials", "true")
        return response

    except Exception as e:
        app.logger.error(f"Błąd przy pobieraniu pliku z S3: {e}")
        return jsonify({"error": "Nie udało się pobrać pliku"}), 500
