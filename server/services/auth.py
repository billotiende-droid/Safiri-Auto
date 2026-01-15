import jwt
from datetime import datetime, timedelta

JWT_SECRET = "dev-secret-key"  # Hardcoded secret for development/testing
JWT_ALGORITHM = "HS256"
JWT_EXP_DELTA_HOURS = 24  # token expires in 24 hours


def generate_token(user_id, role):
    """
    Generate a JWT token for a user or owner.
    """
    payload = {
        "sub": user_id,  # subject
        "role": role,    # role of the account
        "iat": datetime.utcnow(),  # issued at
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXP_DELTA_HOURS)  # expiration
    }

    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token


def decode_token(token):
    """
    Decode and validate a JWT token.
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")


