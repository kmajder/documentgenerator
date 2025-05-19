from flask_pymongo import PyMongo
from flask import Flask
import os
from config import Config
import boto3
mongo = PyMongo()

s3_client = boto3.client(
    's3',
    endpoint_url=Config.S3_ENDPOINT_URL,       
    aws_access_key_id=Config.S3_ACCESS_KEY,
    aws_secret_access_key=Config.S3_SECRET_KEY,
    region_name=Config.S3_REGION
)

def init_extensions(app: Flask):
    mongo.init_app(app)
