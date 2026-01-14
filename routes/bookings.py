from flask import Blueprint, request, jsonify
from datetime import datetime

from server.models import db, Booking, Vehicle

bookings_bp = Blueprint('bookings', __name__)

# Logic to check vehicle availability
def is_vehicle_available(vehicle_id, start_date, end_date):
    conflicting_booking = Booking.query.filter(
        Booking.vehicle_id == vehicle_id,
        Booking.status == 'confirmed',
        Booking.start_date <= end_date,
        Booking.end_date >= start_date
    ).first()

    return conflicting_booking is None

