from flask import Flask
from extensions import mongo
from routes.auth.auth import auth_bp
from routes.templates.templates import templates_bp
from routes.document_generator.document_generator import documents_bp
#from routes.templates.templates import templates_bp
from config import Config
from flask_cors import CORS
# from routes.templates import templates_bp
from initialize_plans import initialize_plans
from initialize_s3 import initialize_s3_bucket

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    mongo.init_app(app)

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(templates_bp, url_prefix='/templates')
    app.register_blueprint(documents_bp, url_prefix='/documents')
    
    # app.register_blueprint(templates_bp, url_prefix='/templates')

    # ✅ Poprawna konfiguracja CORS
    CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

    return app

app = create_app()

if __name__ == "__main__":
    with app.app_context():
        initialize_plans()
        initialize_s3_bucket()
    app.run(host="0.0.0.0", port=5000)
