from flask import Blueprint, request, jsonify, current_app as app
from werkzeug.utils import secure_filename
from extensions import s3_client, mongo
from bson import ObjectId
from config import Config
from authutils.auth_utils import token_required 

BUCKET_NAME = Config.S3_TEMPLATES_BUCKET_NAME
ALLOWED_EXTENSIONS = {"pdf", "docx"}

@token_required
def create_template():
    if "file" not in request.files:
        return jsonify({"error": "Brak pliku"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Pusty plik"}), 400

    ext = file.filename.rsplit(".", 1)[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return jsonify({"error": "Nieprawidłowy format"}), 400

    filename = secure_filename(file.filename)
    user_email = request.user.get("email")
    user_id = request.user.get("user_id")

    if not user_email or not user_id:
        return jsonify({"error": "Brak danych użytkownika"}), 400

    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "Użytkownik nie istnieje"}), 404

    plan = mongo.db.plans.find_one({"name": user.get("plan")})
    if not plan:
        return jsonify({"error": "Plan użytkownika nie znaleziony"}), 400

    max_templates = plan.get("max_templates")
    template_count = user.get("template_count", 0)

    if max_templates is not None and template_count >= max_templates:
        return jsonify({"error": "Przekroczono limit szablonów dla Twojego planu"}), 403

    s3_key = f"{user_email}-{user_id}/{filename}"

    try:
        s3_client.upload_fileobj(
            Fileobj=file,
            Bucket=BUCKET_NAME,
            Key=s3_key,
            ExtraArgs={"ContentType": file.content_type}
        )
        mongo.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$inc": {"template_count": 1}}
        )
    except Exception as e:
        app.logger.error(f"Error uploading file to S3: {e}")
        return jsonify({"error": "Błąd przesyłania pliku"}), 500


    return jsonify({"message": "Plik zapisany w S3", "filename": filename, "key": s3_key}), 200
