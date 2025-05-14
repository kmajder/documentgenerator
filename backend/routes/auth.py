from flask import Blueprint, request, jsonify
from authservice.login_user import login_user

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    try:
        result = login_user(data["email"], data["password"])
        return jsonify(result)
    except ValueError as e:
        return jsonify({"error": str(e)}), 401

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    try:
        result = register_user(data["email"], data["password"])
        return jsonify(result)
    except ValueError as e:
        return jsonify({"error": str(e)}), 401