import os

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "c2943d74b83d3c330e68b8a1c702d69e7bd6aa19f0f48d56f9672a70f2dbe867")
    MONGO_URI = os.environ.get("MONGO_URI", "mongodb://mongo:27017/document-generator")
    JWT_EXPIRATION_DAYS = int(os.environ.get("JWT_EXPIRATION_DAYS", 7))
    HTTP_ONLY_COOKIE_SECURE = os.environ.get("HTTP_ONLY_COOKIE_SECURE", False)  # Set to True in production
    REFRESH_TOKEN_EXPIRY = int(os.environ.get("REFRESH_TOKEN_EXPIRY", 7))  # hours
    ACCESS_TOKEN_EXPIRY = int(os.environ.get("ACCESS_TOKEN_EXPIRY", 2)) # minutes
    DEFAULT_PLAN = os.environ.get("DEFAULT_PLAN", "free")
    
    #S3 CONFIGURATION
    S3_ENDPOINT_URL = os.environ.get("S3_ENDPOINT_URL", "https://s3.amazonaws.com")
    S3_ACCESS_KEY = os.environ.get("S3_ACCESS_KEY", "your_access_key")
    S3_SECRET_KEY = os.environ.get("S3_SECRET_KEY", "your_secret_key")
    S3_TEMPLATES_BUCKET_NAME = os.environ.get("S3_TEMPLATES_BUCKET_NAME", "templates")
    S3_REGION = os.environ.get("S3_REGION", "us-east-1")
    DEFAULT_MAX_DOCUMENTS = int(os.environ.get("DEFAULT_MAX_DOCUMENTS", 10))  # Default max documents for free plan