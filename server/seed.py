from app import app
from extensions import db
from models import User, Owner, Category, Vehicle, Booking, Payment, Review
from datetime import datetime, timedelta

with app.app_context():  #for db access, tells Flask which app the database belongs to
    # Creating two users
    user1 = User(
        name="Hanan Ahmed",
        email="hanan@example.com",
        phone_number="0722000000",
        id_number="12345678",
        residence="Nairobi",
        created_at=datetime.utcnow()
    )
    user2 = User(
        name="Ali Hassan",
        email="ali@example.com",
        phone_number="0722000001",
        id_number="87654321",
        residence="Mombasa",
        created_at=datetime.utcnow()
    )
    
    db.session.add_all([user1, user2])
    db.session.commit() 


    # Creating one Car Owner
    owner1 = Owner(
        user_id=1,
        name="Owner One",
        email="owner1@example.com",
        phone_number="0711000000",
        company_name="Safiri Motors",
        id_number="11223344"
    )

    # Creating two Categories
    cat_sedan = Category(name="Sedan")
    cat_suv = Category(name="SUV")

    # Two Vehicles
    vehicle1 = Vehicle(
        owner_id=1,
        registration_number="KAA123A",
        brand="Toyota",
        model="Corolla",
        category=cat_sedan,
        price_per_day=2500,
        status="available",
        is_verified=True
    )

    vehicle2 = Vehicle(
        owner_id=1,
        registration_number="KAB456B",
        brand="Nissan",
        model="X-Trail",
        category=cat_suv,
        price_per_day=4000,
        status="available",
        is_verified=False
    )

    # Creates 1 booking for vehicle1 by user1 
    booking1 = Booking(
        vehicle=vehicle1,
        customer=user1,
        start_date=datetime.utcnow(),
        end_date=datetime.utcnow() + timedelta(days=2),
        total_amount=5000,
        status="pending"
    )

    # Creates 1 payment for the booking made
    payment1 = Payment(
        booking=booking1,
        amount_paid=5000,
        payment_method="Mpesa",
        platform_commission=500,
        owner_amount=4500,
        payment_status="completed",
        created_at=datetime.utcnow()
    )

    # One Review for the booking
    review1 = Review(
        booking=booking1,
        rating=5,
        comment="Great experience!"
    )

    # Add all to session and commit
    db.session.add_all([
        user1, user2,
        owner1,
        cat_sedan, cat_suv,
        vehicle1, vehicle2,
        booking1,
        payment1,
        review1
    ])
    db.session.commit()

    print("Database seeded successfully!")
