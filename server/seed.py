# seed.py
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash
from app import app, db
from models import User, Owner, Category, Vehicle, Booking, Payment, Review

# Activate Flask app context
with app.app_context():

    db.create_all()
    print("Database initialized with tables!")

    user1 = User(
        name="Hanan Ahmed",
        email="hanan@example.com",
        phone_number="0722000000",
        id_number="12345678",
        residence="Nairobi",
        password=generate_password_hash("123456")  # hashed password
    )
    user2 = User(
        name="Ali Hassan",
        email="ali@example.com",
        phone_number="0722000001",
        id_number="87654321",
        residence="Mombasa",
        password=generate_password_hash("password123")  # hashed password
    )

    db.session.add_all([user1, user2])

    cat_sedan = Category(name="Sedan")
    cat_suv = Category(name="SUV")
    db.session.add_all([cat_sedan, cat_suv])

    owner1 = Owner(
        user=user1,
        name="Owner One",
        email="owner1@example.com",
        phone_number="0711000000",
        company_name="Safiri Motors",
        id_number="11223344",
        password=generate_password_hash("ownerpass"),  # hashed password
        is_verified=True
    )

    db.session.add(owner1)

    vehicle1 = Vehicle(
        owner=owner1,
        registration_number="KAA123A",
        brand="Toyota",
        model="Corolla",
        category=cat_sedan,
        price_per_day=2500,
        status="available",
        is_verified=True
    )
    vehicle2 = Vehicle(
        owner=owner1,
        registration_number="KAB456B",
        brand="Nissan",
        model="X-Trail",
        category=cat_suv,
        price_per_day=4000,
        status="available",
        is_verified=False
    )

    db.session.add_all([vehicle1, vehicle2])

    booking1 = Booking(
        vehicle=vehicle1,
        customer=user1,
        start_date=datetime.utcnow(),
        end_date=datetime.utcnow() + timedelta(days=2),
        total_amount=5000,
        status="pending"
    )

    db.session.add(booking1)

    payment1 = Payment(
        booking=booking1,
        amount_paid=5000,
        payment_method="Mpesa",
        platform_commission=500,
        owner_amount=4500,
        payment_status="completed"
    )

    db.session.add(payment1)

   
    review1 = Review(
        booking=booking1,
        rating=5,
        comment="Great experience!"
    )

    db.session.add(review1)

    db.session.commit()
    print("Seed data inserted successfully!")
