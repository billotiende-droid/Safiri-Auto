from flask import Blueprint, request, jsonify
from datetime import datetime

from server.models import db, Booking, vehicles

bookings_bp = Blueprint('bookings', __name__)

