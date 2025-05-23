from flask import Blueprint, request, jsonify
import jwt
from config import Config
from flask import make_response
from extensions import mongo
from bson import ObjectId

def get_current_user():
    access_token = request.cookies.get("access_token")
    if not access_token:
        return jsonify({"error": "Brak tokenu"}), 401

    try:
        decoded = jwt.decode(access_token, Config.SECRET_KEY, algorithms=["HS256"])
        user_id = decoded["user_id"]
        
        # Pobierz użytkownika z bazy danych
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "Użytkownik nie istnieje"}), 404
            
        # Pobierz szczegóły planu użytkownika
        plan_name = user.get("plan", Config.DEFAULT_PLAN)
        plan = mongo.db.plans.find_one({"name": plan_name}) or {}
        max_documents = plan.get("max_documents_per_month", 0)
        
        doc_count = user.get("doc_count", 0)
        return jsonify({
            "user_id": user_id,
            "username": decoded["username"],
            "email": decoded["email"],
            "exp": decoded["exp"],
            "plan": plan_name,
            "doc_count": doc_count,
            "max_documents_per_month": max_documents
        }), 200
        
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token wygasł"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Nieprawidłowy token"}), 401
    except Exception as e:
        return jsonify({"error": f"Błąd serwera: {str(e)}"}), 500