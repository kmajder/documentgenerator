from flask import Blueprint, request, jsonify
from authservice.register_user import register_user
from authservice.login_user import login_user_with_cookies
from authservice.refresh_token import refresh_access_token
from authservice.logout_user import logout_user
from authservice.me import get_current_user

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    try:
        result = register_user(data["username"], data["email"], data["password"])
        return jsonify(result)
    except ValueError as e:
        return jsonify({"error": str(e)}), 401
    
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    try:
        return login_user_with_cookies(data["email"], data["password"])
    except ValueError as e:
        return jsonify({"error": str(e)}), 401
    

@auth_bp.route("/refresh", methods=["POST"])
def refresh():
    return refresh_access_token()


@auth_bp.route("/me", methods=["GET"])
def me():
    return get_current_user()

@auth_bp.route("/logout", methods=["POST"])
def logout():
    return logout_user()

