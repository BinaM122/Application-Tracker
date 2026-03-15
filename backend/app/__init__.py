import os
from flask import Flask
from .extensions import db
from dotenv import load_dotenv
from pathlib import Path
import firebase_admin
from firebase_admin import credentials

load_dotenv(Path(__file__).parent.parent/'.env')

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    db.init_app(app)
    
    with app.app_context():
        from .models import user, application
        print("creating tables")
        db.create_all()
        print("tables created!")
    @app.route('/test')
    def test():
        return 'Hello World' 
    return app
