from flask import Flask
from flask_restful import Api
from flask_migrate import Migrate
from flask_cors import CORS
from models import db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///safiri.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(
    app,
    origins=["http://localhost:3000"],
    supports_credentials=True
)

db.init_app(app)
migrate = Migrate(app, db)
api = Api(app)


# Import routes
from routes.vehicles import VehicleList, VehicleResource, VehicleStatus
from routes.bookings import BookingListResource, BookingResource
from routes.categories import CategoryList
from routes.payments import PaymentsResource, PaymentByID
from routes.logins import Login
from routes.user_profile import UserProfile


# Register routes
api.add_resource(VehicleList, '/api/vehicles')
api.add_resource(VehicleResource, '/api/vehicles/<int:id>')
api.add_resource(VehicleStatus, '/api/vehicles/<int:id>/status')

api.add_resource(BookingListResource, "/api/bookings")
api.add_resource(BookingResource, "/api/bookings/<int:id>")

api.add_resource(PaymentsResource,'/api/payments')
api.add_resource(PaymentByID,'/api/payment/<int:id>')

api.add_resource(CategoryList, '/api/categories')
api.add_resource(UserProfile, '/api/signup')

api.add_resource(Login, '/api/login' )

if __name__ == '__main__':
    app.run(port=5555, debug=True)
