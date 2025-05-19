from flask import Blueprint, request, jsonify
import jwt
from config import Config
from flask import make_response
from extensions import mongo

def get_current_user():
    access_token = request.cookies.get("access_token")
    if not access_token:
        return jsonify({"error": "Brak tokenu"}), 401

    try:
        decoded = jwt.decode(access_token, Config.SECRET_KEY, algorithms=["HS256"])
        return jsonify({
            "user_id": decoded["user_id"],
            "username": decoded["username"],
            "email": decoded["email"],
            "plan": decoded["plan"],
            "exp": decoded["exp"],
            "doc_count": decoded["doc_count"],
        }), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token wygasł"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Nieprawidłowy token"}), 401