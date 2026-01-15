
from flask_restful import Resource
from flask import request
from services.auth import decode_token

class ProtectedResource(Resource):
    """
    Base class for JWT-protected routes.
    """

    def dispatch_request(self, *args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return {"error": "Missing token"}, 401
