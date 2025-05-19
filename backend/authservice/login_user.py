from flask import make_response, jsonify
from extensions import mongo
from werkzeug.security import check_password_hash
import jwt
import datetime
from config import Config

ACCESS_TOKEN_EXPIRY = Config.ACCESS_TOKEN_EXPIRY  # minut
REFRESH_TOKEN_EXPIRY = Config.REFRESH_TOKEN_EXPIRY # dni

def generate_access_token(user_id, email, username, plan, doc_count):
    return jwt.encode({
        "user_id": str(user_id),
        "email": email,
        "username": username,
        "plan": plan,
        "doc_count": doc_count,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRY)
    }, Config.SECRET_KEY, algorithm="HS256")

def generate_refresh_token(user_id):
    return jwt.encode({
        "user_id": str(user_id),
        "type": "refresh",
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=REFRESH_TOKEN_EXPIRY)
    }, Config.SECRET_KEY, algorithm="HS256")

def login_user_with_cookies(email, password):
    user = mongo.db.users.find_one({"email": email})
    if not user or not check_password_hash(user["password_hash"], password):
        raise ValueError("Invalid credentials")
    print(user)
    access_token = generate_access_token(user["_id"], user["email"], user["username"], user.get("plan"), user.get("doc_count"))
    print(user)
    refresh_token = generate_refresh_token(user["_id"])

    # Save refresh token to DB
    mongo.db.refresh_tokens.insert_one({
        "user_id": user["_id"],
        "token": refresh_token,
        "created_at": datetime.datetime.utcnow(),
        "expires_at": datetime.datetime.utcnow() + datetime.timedelta(days=REFRESH_TOKEN_EXPIRY),
        "revoked": False,
    })

    response = make_response(jsonify({
        "message": "Zalogowano",
        "user_id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"],
        "plan": user.get("plan", Config.DEFAULT_PLAN),
        "doc_count": user["doc_count"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRY)
    }))
    response.set_cookie("access_token", access_token, httponly=True, secure=False, samesite="Lax", max_age=Config.ACCESS_TOKEN_EXPIRY * 60)
    response.set_cookie("refresh_token", refresh_token, httponly=True, secure=False, samesite="Lax", max_age=Config.REFRESH_TOKEN_EXPIRY * 3600)

    return response
