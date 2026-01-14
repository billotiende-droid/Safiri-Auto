# # server/app.py
# from flask import Flask
# from config import Config
# from flask_cors import CORS
# from flask_restful import Api
# from extensions import db, migrate

# def create_app():
#     app = Flask(__name__)
#     app.config.from_object(Config)

#     # Initialize extensions with this app
#     db.init_app(app)
#     migrate.init_app(app, db)
#     CORS(app)
#     api = Api(app)



# # ----------------------
# # Inline configuration
# # ----------------------
# class Config:
#     SQLALCHEMY_DATABASE_URI = "sqlite:///safiri.db"
#     SQLALCHEMY_TRACK_MODIFICATIONS = False
#     SECRET_KEY = "dev-secret-key"

# # ----------------------
# # App setup
# # ----------------------
# app = Flask(__name__)
# app.config.from_object(Config)

# # Initialize extensions
# db.init_app(app)
# migrate.init_app(app, db)
# CORS(app)
# api = Api(app)

# # Health check route
# @app.route("/health")
# def health():
#     return {"status": "ok"}


#     @app.route("/health")
#     def health():
#         return {"status": "ok"}

#     return app

# # Optional: create global app for Flask CLI
# app = create_app()
from flask import Flask
from flask_restful import Api
from flask_migrate import Migrate
from models import db, User, Owner, Category, Vehicle, Booking, Payment, Review

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///safiri.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)
api = Api(app)

# Initialize database (create tables)
with app.app_context():
    db.create_all()
    print("Database initialized with tables!")

if __name__ == '__main__':
    app.run(port=5555, debug=True)
