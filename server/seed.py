# seed.py
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash
from app import app, db
from models import User, Owner, Category, Vehicle, Booking, Payment, Review

# Activate Flask app context
with app.app_context():

    db.create_all()
    print("Database initialized with tables!")

    # Only add users if they don't exist
    if not User.query.filter_by(email="hanan@example.com").first():
        user1 = User(
            name="Hanan Ahmed",
            email="hanan@example.com",
            phone_number="0722000000",
            id_number="12345678",
            residence="Nairobi",
            password=generate_password_hash("123456")  # hashed password
        )
        db.session.add(user1)

    if not User.query.filter_by(email="ali@example.com").first():
        user2 = User(
            name="Ali Hassan",
            email="ali@example.com",
            phone_number="0722000001",
            id_number="87654321",
            residence="Mombasa",
            password=generate_password_hash("password123")  # hashed password
        )
        db.session.add(user2)

    # Only add categories if they don't exist
    if not Category.query.filter_by(name="Sedan").first():
        cat_sedan = Category(name="Sedan")
        db.session.add(cat_sedan)

    if not Category.query.filter_by(name="SUV").first():
        cat_suv = Category(name="SUV")
        db.session.add(cat_suv)

    db.session.commit()  # Commit to get IDs

    # Get or create categories
    cat_sedan = Category.query.filter_by(name="Sedan").first()
    cat_suv = Category.query.filter_by(name="SUV").first()

    # Only add owner if doesn't exist
    if not Owner.query.filter_by(email="owner1@example.com").first():
        user1 = User.query.filter_by(email="hanan@example.com").first()
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
        db.session.commit()  # Commit to get owner ID

    owner1 = Owner.query.filter_by(email="owner1@example.com").first()

    # Only add vehicles if they don't exist
    vehicles_data = [
        ("KAA123A", "Toyota", "Corolla", cat_sedan, 2500, True, "2005_toyota_corolla-pic-8721495962592854439-1024x768.jpeg"),
        ("KAB456B", "Nissan", "X-Trail", cat_suv, 4000, False, "2017-Nissan-X-Trail-2.0-4WD-NT32-a.jpg"),
        ("KAC789C", "Honda", "Civic", cat_sedan, 3000, True, "civic.jpeg"),
        ("KAD012D", "Toyota", "Land Cruiser", cat_suv, 5000, True, "2020-toyota-land-cruiser-001.webp"),
        ("KAE345E", "Mercedes", "C-Class", cat_sedan, 4500, False, "Mercedes-Benz-S-Class-wallpaper-1920x960.jpg.webp"),
    ]

    for reg_num, brand, model, category, price, verified, image_path in vehicles_data:
        if not Vehicle.query.filter_by(registration_number=reg_num).first():
            vehicle = Vehicle(
                owner=owner1,
                registration_number=reg_num,
                brand=brand,
                model=model,
                category=category,
                price_per_day=price,
                status="available",
                is_verified=verified,
                image_path=image_path
            )
            db.session.add(vehicle)

    # No mock bookings - only real user-generated data
    pass

    db.session.commit()
    print("Seed data inserted successfully!")
