import jwt
from datetime import datetime, timedelta

# ----------------------------
# JWT Configuration
# ----------------------------
JWT_SECRET = "dev-secret-key"  # Hardcoded secret for development/testing
JWT_ALGORITHM = "HS256"
JWT_EXP_DELTA_HOURS = 24  # token expires in 24 hours
