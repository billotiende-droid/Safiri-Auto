from flask import Flask, request, make_response
from flask_restful import Api
from flask_migrate import Migrate
from models import db
from flask_cors import CORS
import os

app = Flask(__name__, static_url_path='/uploads', static_folder=os.path.abspath('../Auto-Safiris'))

CORS(app, origins=["http://localhost:3000"], supports_credentials=True, allow_headers=["Content-Type", "Authorization"], methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])

# Add CORS headers to all responses
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,PATCH,DELETE,OPTIONS'
    return response

app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.abspath("./safiri.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)

api = Api(app)


# Import routes
from routes.vehicles import VehicleList, VehicleResource, VehicleStatus
from routes.bookings import BookingListResource, BookingResource
from routes.categories import CategoryList
from routes.payments import PaymentsResource, PaymentByID
from routes.logins import Login
from routes.user_profile import UserProfile, SignupResource, ProfileResource


# Register routes
api.add_resource(VehicleList, '/api/vehicles')
api.add_resource(VehicleResource, '/api/vehicles/<int:id>')
api.add_resource(VehicleStatus, '/api/vehicles/<int:id>/status')

api.add_resource(BookingListResource, "/api/bookings")
api.add_resource(BookingResource, "/api/bookings/<int:id>")

api.add_resource(PaymentsResource,'/api/payments')
api.add_resource(PaymentByID,'/api/payment/<int:id>')

api.add_resource(CategoryList, '/categories')
api.add_resource(SignupResource, '/api/signup')
api.add_resource(UserProfile, '/api/profile')
api.add_resource(ProfileResource, '/api/profile/<int:id>')

api.add_resource(Login, '/api/login' )





if __name__ == '__main__':
    app.run(port=5555, debug=True)
