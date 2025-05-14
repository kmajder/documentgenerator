from flask import Flask
from extensions import mongo
from routes.auth import auth_bp
from config import Config
#from routes.templates import templates_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    mongo.init_app(app)

    app.register_blueprint(auth_bp, url_prefix='/auth')
    #app.register_blueprint(templates_bp, url_prefix='/templates')

    return app

app = create_app()
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
