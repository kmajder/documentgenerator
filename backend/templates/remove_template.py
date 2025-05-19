from flask import request, jsonify, current_app as app
from extensions import s3_client
from config import Config
from authutils.auth_utils import token_required
from extensions import mongo
from bson import ObjectId
@token_required
def remove_template_service(key):

    user_id = request.user.get("user_id")
    user_email = request.user.get("email")

    if not key:
        return jsonify({"error": "Brak klucza pliku"}), 400
    if not user_id or not user_email:
        return jsonify({"error": "Brak danych użytkownika"}), 400

    prefix = f"{user_email}-{user_id}/"
    if not key.startswith(prefix):
        return jsonify({"error": "Nie masz dostępu do tego pliku"}), 403

    try:
        s3_client.delete_object(Bucket=Config.S3_TEMPLATES_BUCKET_NAME, Key=key)
        mongo.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$inc": {"template_count": -1}}
        )
        app.logger.info(f"Usunięto szablon: {key}")
        return jsonify({"success": True}), 200
    except Exception as e:
        app.logger.error(f"Błąd przy usuwaniu szablonu: {e}")
        return jsonify({"error": "Nie udało się usunąć szablonu"}), 500
