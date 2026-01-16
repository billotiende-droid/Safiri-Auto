from flask_restful import Resource
from flask import request
from flask_cors import cross_origin
from werkzeug.security import generate_password_hash
from models import db, User, Owner
from services.auth import generate_token

class UserProfile(Resource):

    @cross_origin(origins="http://localhost:3000", supports_credentials=True)
    def post(self):
        # Create a new user or owner account.
        data = request.get_json()

        # Input validation
        if not data:
            return {"error": "Request must be JSON"}, 400

        required_fields = ["name", "email", "phone_number", "id_number", "password"]
        for field in required_fields:
            if not data.get(field):
                return {"error": f"{field} is required"}, 400

        role = data.get("role", "user").lower()
        if role not in ["user", "owner"]:
            return {"error": "Role must be either 'user' or 'owner'"}, 400

        # Check for existing account (email/phone uniqueness across both tables)
        existing_user = User.query.filter(
            (User.email == data["email"]) | (User.phone_number == data["phone_number"])
        ).first()
        existing_owner = Owner.query.filter(
            (Owner.email == data["email"]) | (Owner.phone_number == data["phone_number"])
        ).first()

        if existing_user or existing_owner:
            return {"error": "Account with this email or phone number already exists"}, 409

        password_hashed = generate_password_hash(data["password"])

        if role == "user":
            user = User(
                name=data["name"],
                email=data["email"],
                phone_number=data["phone_number"],
                id_number=data["id_number"],
                residence=data.get("residence", ""),
                password=password_hashed
            )
            db.session.add(user)
            db.session.commit()

            token = generate_token(user.id, "user")

            response = {
                "message": "User created successfully",
                "role": "user",
                "token": token,
                "account": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "phone_number": user.phone_number,
                    "residence": user.residence
                }
            }
            return response, 201

        # role == "owner" : create a linked User row first, then Owner
        user = User(
            name=data["name"],
            email=data["email"],
            phone_number=data["phone_number"],
            id_number=data["id_number"],
            residence=data.get("residence", ""),
            password=password_hashed
        )
        db.session.add(user)
        db.session.flush()  # assign user.id without committing

        owner = Owner(
            user_id=user.id,
            name=data["name"],
            email=data["email"],
            phone_number=data["phone_number"],
            company_name=data.get("company_name", ""),
            id_number=data["id_number"],
            password=password_hashed,
            is_verified=False
        )
        db.session.add(owner)
        db.session.commit()

        token = generate_token(owner.id, "owner")

        response = {
            "message": "Owner created successfully",
            "role": "owner",
            "token": token,
            "account": {
                "id": owner.id,
                "name": owner.name,
                "email": owner.email,
                "phone_number": owner.phone_number,
                "company_name": owner.company_name
            }
        }
        return response, 201
