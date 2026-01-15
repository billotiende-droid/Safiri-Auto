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
from models import user, Owner

# login resource

class Login(Resource):

    def post(self):
        pass

    