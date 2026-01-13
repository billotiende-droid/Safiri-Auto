from flask_restful import Resource
from flask import request
from server import db, Payment, Booking
from datetime import datetime
import random
import string

# Helper Functions
def generate_payment_ref():
    # Simulates M-Pesa transaction code (e.g., QKR43W21Z)
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=9))


def calculate_commission(amount):
    # Calculate platform commission and owner payout. Platform takes 10% commission
    commission = int(amount * 0.10)
    owner_amount = amount - commission
    return commission, owner_amount


