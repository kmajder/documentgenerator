from extensions import mongo
from werkzeug.security import check_password_hash
import jwt
import datetime
from config import Config

SECRET_KEY = Config.SECRET_KEY

def login_user(email, password):
    user = mongo.db.users.find_one({"email": email})
    if not user or not check_password_hash(user["password_hash"], password):
        raise ValueError("Invalid credentials")

    token = jwt.encode({
        "user_id": str(user["_id"]),
        "plan": user.get("plan", "free"),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, SECRET_KEY, algorithm="HS256")

    return {
        "message": "Logged in",
        "token": token,
        "plan": user.get("plan", "free")
    }
