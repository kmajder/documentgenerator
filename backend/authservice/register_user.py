from extensions import mongo
from werkzeug.security import generate_password_hash
from bson.objectid import ObjectId
import datetime

def register_user(email, password, plan="free"):
    if mongo.db.users.find_one({"email": email}):
        raise ValueError("User already exists")

    password_hash = generate_password_hash(password)

    user_id = mongo.db.users.insert_one({
        "email": email,
        "password_hash": password_hash,
        "plan": plan,
        "created_at": datetime.datetime.utcnow(),
        "doc_count": 0
    }).inserted_id

    return {
        "message": "User registered",
        "user_id": str(user_id),
        "plan": plan
    }
