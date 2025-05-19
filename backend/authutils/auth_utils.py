# auth_utils.py
from functools import wraps
from flask import request, jsonify, current_app as app
import jwt

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get("access_token")
        if not token:
            return jsonify({"message": "Brak tokena"}), 403
        try:
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
            request.user = data
        except Exception:
            return jsonify({"message": "Token nieprawidłowy"}), 403
        return f(*args, **kwargs)
    return decorated
