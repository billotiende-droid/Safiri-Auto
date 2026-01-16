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
        
        try:
            # Header format: "Bearer <token>"
            self.user_payload = decode_token(token.split(" ")[1])
        except Exception as e:
            return {"error": str(e)}, 401

        return super().dispatch_request(*args, **kwargs)
