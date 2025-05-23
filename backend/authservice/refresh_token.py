from flask import request
import jwt
from flask import jsonify, make_response
from extensions import mongo
from bson import ObjectId
from config import Config
import datetime

def generate_access_token(user_id, email, username):
    return jwt.encode({
        "user_id": str(user_id),
        "email": email,
        "username": username,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=Config.ACCESS_TOKEN_EXPIRY),
    }, Config.SECRET_KEY, algorithm="HS256")

def refresh_access_token():
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        return jsonify({"error": "Brak refresh tokena"}), 401

    try:
        decoded = jwt.decode(refresh_token, Config.SECRET_KEY, algorithms=["HS256"])
        if decoded.get("type") != "refresh":
            raise jwt.InvalidTokenError("Zły typ tokena")

        token_in_db = mongo.db.refresh_tokens.find_one({
            "token": refresh_token,
            "revoked": False
        })

        if not token_in_db:
            return jsonify({"error": "Token odświeżania unieważniony lub nieistniejący"}), 401

        user = mongo.db.users.find_one({"_id": ObjectId(decoded["user_id"])})
        if not user:
            return jsonify({"error": "Użytkownik nie istnieje"}), 404

        # Pobierz aktualne dane planu
        plan = mongo.db.plans.find_one({"name": user.get("plan", Config.DEFAULT_PLAN)}) or {}
        max_documents = plan.get("max_documents_per_month")

        new_access_token = generate_access_token(
            user["_id"],
            user["email"],
            user["username"],
        )

        response = make_response(jsonify({"message": "Token odświeżony"}))
        response.set_cookie("access_token", new_access_token, httponly=True, secure=False, samesite="Strict", max_age=Config.ACCESS_TOKEN_EXPIRY * 60)

        return response

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token wygasł"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Nieprawidłowy token"}), 401