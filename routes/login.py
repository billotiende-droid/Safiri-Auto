"""
EXPECTATIONS
1. should accept credentials only (email && passwords)
2.validation fields for; missing fields, empty values and invalid JSON
3.Authentication(import from auth.py)
4.return response for successful login
5.Role baseed access control
"""

# Imports
from flask_restful import Resource 
from models import User, Owner
from services.auth_service import generate_token
from flask import request
from werkzeug.security import check_password_hash

# login resource

class Login(Resource):

    def post(self):
        data = request.get_json()

        #  input validation
        if not data:
            return {"error": "Request must be JSON"}, 400

        identifier = data.get("email") or data.get("phone_number")
        password = data.get("password")

        if not identifier or not password:
            return {"error": "Email/phone and password are required"}, 400

        # search for user table(to get credentials)
        account = User.query.filter(
            (User.email == identifier) | (User.phone_number == identifier)
        ).first()
        role = "user"

        # if not users try owners tables

        if not account:
            account = Owner.query.filter(
                (Owner.email == identifier) | (Owner.phone_number == identifier)
            ).first()
            role = "owner"

        # for invalid credentials
        if not account:
            return {"error": "Invalid credentials"}, 401
        
        # Verify password
        if not check_password_hash(account.password, password):
            return {"error": "Invalid credentials"}, 401
        
        #  owners verification check
        if role == "owner" and not getattr(account, "is_verified", True):
            return {"error": "Account not verified"}, 403
        
        response = {
            "message": "Login successful",
            "token": token,
            "role": role,
            "account": {
                "id": account.id,
                "name": getattr(account, "name", None)
            }
        }

        return response, 200


