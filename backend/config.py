import os

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "domyślny_tajny_klucz")
    MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
    JWT_EXPIRATION_DAYS = int(os.environ.get("JWT_EXPIRATION_DAYS", 7))
