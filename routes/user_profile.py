from services.protected_resource import ProtectedResource
from flask import request
from models import User, Owner


class UserProfile(ProtectedResource) :

    # GET
    def get(self):
        user_id = self.user_payload["sub"]
        role = self.user_payload["role"]

        if role == "user":
            account = User.query.get(user_id)
        else :
            account = Owner.query.get(user_id)
        
        if not account :
            return {"error":"Account not found."}, 404
        
        return {
            "id": account.id,
            "name": getattr(account, "name", None),
            "email": account.email,
            "phone_number": getattr(account, "phone_number", None),
            "role": role
        }, 200