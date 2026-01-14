from flask import Flask
from flask_restful import Api
from flask_migrate import Migrate
from models import db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///safiri.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)
api = Api(app)

# Import routes
from routes.vehicles import VehicleList, VehicleResource, VehicleStatus
from routes.bookings import BookingListResource, BookingResource
from routes.categories import CategoryList
from routes.payments import Payments, PaymentByID


# Register routes
api.add_resource(VehicleList, '/api/vehicles')
api.add_resource(VehicleResource, '/api/vehicles/<int:id>')
api.add_resource(VehicleStatus, '/vehicles/<int:id>/status')

api.add_resource(BookingListResource, "/api/bookings")
api.add_resource(BookingResource, "/api/bookings/<int:id>")

api.add_resource(Payments,'/api/payments')
api.add_resource(PaymentByID,'/api/payment/<int:id>')

api.add_resource(CategoryList, '/categories')




# Initialize database (create tables)
with app.app_context():
    db.create_all()
    print("Database initialized with tables!")

if __name__ == '__main__':
    app.run(port=5555, debug=True)
