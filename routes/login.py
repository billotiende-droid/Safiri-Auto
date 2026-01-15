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


# login resource

class Login(Resource):

    def post(self):
        data = reques.get_json()

        # search for user table(to get credentials)
        account =User.query.filter((user.email == identifier) (user.phone_number == identifier).first())
        role = "user"
        pass

