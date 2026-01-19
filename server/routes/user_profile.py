# user_profile.py
from flask_restful import Resource
from flask import request
from werkzeug.security import generate_password_hash
from models import db, User, Owner
from services.auth import generate_token  # optional: auto-login
from services.protected_resource import ProtectedResource

class UserProfile(ProtectedResource):

    def get(self):
        """
        Get the current user's profile.
        """
        user_id = self.user_payload['sub']
        role = self.user_payload['role']

        if role == 'user':
            account = User.query.get(user_id)
        else:
            account = Owner.query.get(user_id)

        if not account:
            return {"error": "Account not found"}, 404

        response = {
            "id": account.id,
            "name": getattr(account, "name", None),
            "email": getattr(account, "email", None),
            "phone_number": getattr(account, "phone_number", None),
            "residence": getattr(account, "residence", None),
            "role": role
        }

        if role == 'owner':
            response["company_name"] = getattr(account, "company_name", None)
            response["is_verified"] = getattr(account, "is_verified", False)

        return response, 200


class SignupResource(Resource):
    """Public signup endpoint - no authentication required"""

    def post(self):
        """
        Create a new user or owner account.
        Send "role": "user" or "owner" in JSON payload.
        """
        data = request.get_json()

        # Input validation
        if not data:
            return {"error": "Request must be JSON"}, 400

        required_fields = ["name", "email", "phone_number", "id_number", "residence", "password", "role"]
        for field in required_fields:
            if not data.get(field):
                return {"error": f"{field} is required"}, 400

        role = data["role"].lower()
        if role not in ["user", "owner"]:
            return {"error": "Role must be either 'user' or 'owner'"}, 400

        # Check for existing account
        existing_user = User.query.filter(
            (User.email == data["email"]) | (User.phone_number == data["phone_number"])
        ).first()
        existing_owner = Owner.query.filter(
            (Owner.email == data["email"]) | (Owner.phone_number == data["phone_number"])
        ).first()

        if existing_user or existing_owner:
            return {"error": "Account with this email or phone number already exists"}, 409

        # Create account based on role
        if role == "user":
            account = User(
                name=data["name"],
                email=data["email"],
                phone_number=data["phone_number"],
                id_number=data["id_number"],
                residence=data["residence"],
                password=generate_password_hash(data["password"])
            )
        else:  # role == "owner"
            account = Owner(
                name=data["name"],
                email=data["email"],
                phone_number=data["phone_number"],
                id_number=data["id_number"],
                company_name=data.get("company_name", ""),  # optional for owner
                password=generate_password_hash(data["password"]),
                is_verified=False  # default to not verified
            )

        db.session.add(account)
        db.session.commit()

        # Optional: auto-generate JWT token
        token = generate_token(account.id, role)

        # Response
        response = {
            "message": f"{role.capitalize()} created successfully",
            "role": role,
            "token": token,
            "account": {
                "id": account.id,
                "name": getattr(account, "name", None),
                "email": getattr(account, "email", None),
                "phone_number": getattr(account, "phone_number", None),
                "residence": getattr(account, "residence", None),
                "company_name": getattr(account, "company_name", None)  # only for owner
            }
        }

        return response, 201


class ProfileResource(ProtectedResource):
    """Protected profile endpoints for authenticated users"""

    def get(self, id=None):
        """Get user profile by ID (for admin) or current user"""
        user_id = self.user_payload['sub']
        role = self.user_payload['role']
        
        target_id = id if id else user_id

        if role == 'user':
            account = User.query.get(target_id)
        else:
            account = Owner.query.get(target_id)

        if not account:
            return {"error": "Account not found"}, 404

        response = {
            "id": account.id,
            "name": getattr(account, "name", None),
            "email": getattr(account, "email", None),
            "phone_number": getattr(account, "phone_number", None),
            "residence": getattr(account, "residence", None),
            "role": role
        }

        if role == 'owner':
            response["company_name"] = getattr(account, "company_name", None)
            response["is_verified"] = getattr(account, "is_verified", False)

        return response, 200
