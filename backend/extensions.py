from flask_pymongo import PyMongo
from flask import Flask
import os

mongo = PyMongo()

def init_extensions(app: Flask):
    mongo.init_app(app)
