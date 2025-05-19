from flask import request
from flask import jsonify, make_response
from extensions import mongo
import jwt
from bson import ObjectId
from config import Config

def logout_user():
    refresh_token = request.cookies.get("refresh_token")

    if refresh_token:
        try:
            decoded = jwt.decode(refresh_token, Config.SECRET_KEY, algorithms=["HS256"])
            mongo.db.refresh_tokens.update_many({
                "user_id": ObjectId(decoded["user_id"]),
                "token": refresh_token
            }, {
                "$set": {"revoked": True}
            })
        except jwt.InvalidTokenError:
            pass  # Nieprawidłowy token, i tak nic nie robimy

    response = jsonify({"message": "Wylogowano"})
    response.set_cookie("access_token", "", httponly=True, secure=False, samesite="Lax", max_age=0)
    response.set_cookie("refresh_token", "", httponly=True, secure=False, samesite="Lax", max_age=0)
    return response
