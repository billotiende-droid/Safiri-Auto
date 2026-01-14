from datetime import datetime, timedelta
from app import app, db
from models import User, Owner, Category, Vehicle, Booking, Payment, Review

# 1. Activate Flask app context
with app.app_context():

    # 2. Create tables if they don't exist
    db.create_all()
    print("Database initialized with tables!")

    # 3. Seed data
    # Users
    user1 = User(
        name="Hanan Ahmed",
        email="hanan@example.com",
        phone_number="0722000000",
        id_number="12345678",
        residence="Nairobi"
    )
    user2 = User(
        name="Ali Hassan",
        email="ali@example.com",
        phone_number="0722000001",
        id_number="87654321",
        residence="Mombasa"
    )
    db.session.add_all([user1, user2])

    # Categories
    cat_sedan = Category(name="Sedan")
    cat_suv = Category(name="SUV")
    db.session.add_all([cat_sedan, cat_suv])

    # Owner
    owner1 = Owner(
        user=user1,
        name="Owner One",
        email="owner1@example.com",
        phone_number="0711000000",
        company_name="Safiri Motors",
        id_number="11223344"
    )
    db.session.add(owner1)

    # Vehicles
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

    # Booking
    booking1 = Booking(
        vehicle=vehicle1,
        customer=user1,
        start_date=datetime.utcnow(),
        end_date=datetime.utcnow() + timedelta(days=2),
        total_amount=5000,
        status="pending"
    )
    db.session.add(booking1)

    # Payment
    payment1 = Payment(
        booking=booking1,
        amount_paid=5000,
        payment_method="Mpesa",
        platform_commission=500,
        owner_amount=4500,
        payment_status="completed"
    )
    db.session.add(payment1)

    # Review
    review1 = Review(
        booking=booking1,
        rating=5,
        comment="Great experience!"
    )
    db.session.add(review1)

    # Commit all changes
    db.session.commit()
    print("Database seeded successfully!")
