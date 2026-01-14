from datetime import datetime
from extensions import db 
from sqlalchemy_serializer import SerializerMixin

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    phone_number = db.Column(db.String(20), nullable=False, unique=True)
    id_number = db.Column(db.String(20), nullable=False, unique=True)
    residence = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    #relationships
    bookings = db.relationship('Booking', back_populates='customer', cascade='all, delete-orphan')
    owner = db.relationship('Owner', back_populates='user', uselist=False, cascade='all, delete-orphan')
   
    serialize_rules = ('-bookings.customer', '-owner.user')


class Owner(db.Model, SerializerMixin):
    __tablename__ = 'owners'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)

    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    phone_number = db.Column(db.String(20), nullable=False, unique=True)
    company_name = db.Column(db.String(100))
    id_number = db.Column(db.String(20), nullable=False, unique=True)

    #relationships
    user = db.relationship('User', back_populates='owner')
    vehicles = db.relationship('Vehicle', back_populates='owner', cascade='all, delete-orphan')

    serialize_rules = ('-user.owner', '-vehicles.owner')

   

class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)

    #relationships
    vehicles = db.relationship('Vehicle', back_populates='category', cascade='all, delete-orphan')

    serialize_rules = ('-vehicles.category',)


class Vehicle(db.Model, SerializerMixin):
    __tablename__ = 'vehicles'

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('owners.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)

    registration_number = db.Column(db.String(50), nullable=False, unique=True)
    brand = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(50), nullable=False)
    price_per_day = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='available')
    is_verified = db.Column(db.Boolean, default=False)

    #relationships
    owner = db.relationship('Owner', back_populates='vehicles')
    category = db.relationship('Category', back_populates='vehicles')
    bookings = db.relationship('Booking', back_populates='vehicle', cascade='all, delete-orphan')

    serialize_rules = ('-owner.vehicles', '-category.vehicles', '-bookings.vehicle')


class Booking(db.Model, SerializerMixin):
    __tablename__ = 'bookings'

    id = db.Column(db.Integer, primary_key=True)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    total_amount = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default='pending')
    
    #relationships
    customer = db.relationship('User', back_populates='bookings')
    vehicle = db.relationship('Vehicle', back_populates='bookings')
    payment = db.relationship('Payment', back_populates='booking', uselist=False, cascade='all, delete-orphan')
    review = db.relationship('Review', back_populates='booking', uselist=False, cascade='all, delete-orphan')

    serialize_rules = ('-customer.bookings', '-vehicle.bookings', '-payment.booking', '-review.booking')


class Payment(db.Model, SerializerMixin):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'), nullable=False, unique=True)

    amount_paid = db.Column(db.Integer, nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    platform_commission = db.Column(db.Integer, nullable=False)
    owner_amount = db.Column(db.Integer, nullable=False)
    payment_status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    booking = db.relationship('Booking', back_populates='payment')

    serialize_rules = ('-booking.payment',)


class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'
    

    #constraints
    __table_args__ = (
        db.CheckConstraint('rating >= 1 AND rating <= 5', name='check_rating_range'),
    )

    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'), nullable=False, unique=True)

    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.String(255))
    
    booking = db.relationship('Booking', back_populates='review')

    serialize_rules = ('-booking.review',)

    def to_dict(self):
        return {
            "id": self.id,
            "booking_id": self.booking_id,
            "rating": self.rating,
            "comment": self.comment
        }
