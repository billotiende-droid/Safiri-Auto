from flask import Flask
from .config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_restful import Api, Resource




db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)  # Load config from config.py

    # Initialize extensions with this app
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    api = Api(app)

    #Import resources here to avoid circular imports
    from .routes.bookings import BookingListResource, BookingResource
    from .routes.category import CategoryList
    from .routes.vehicles import VehicleList, VehicleResource, VehicleStatus
    from .routes.payments import Payments, PaymentByID


    # Register resources
   

    # health check route
    @app.route("/health")
    def health():
        return {"status": "ok"}

    return app

# Create a global app instance for Flask CLI
app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
