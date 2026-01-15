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

        if not acount:
            account = ownner.query.filter(Owner.email == identifier).first
            role = "owner"

