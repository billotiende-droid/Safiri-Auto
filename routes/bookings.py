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

# POST for Booking
@bookings_bp.route('/bookings', methods=['POST'])
def create_booking():
    
    data = request.get_json()

    try:
        vehicle_id = data.get('vehicle_id')
        customer_id = data.get('customer_id')

        start_date = data.get('start_date'), 'start_date'
        end_date = data.get('end_date'), 'end_date'

        if start_date > end_date:
            return jsonify({'error': 'Start date cannot be after end date'}), 400
        
        vehicle = Vehicle.query.get(vehicle_id)
        if not vehicle:
            return jsonify({'error': 'Vehicle not found'}), 404
        
        if vehicle.status != 'available':
            return jsonify({'error': 'Vehicle not available'}), 400
        
        if not is_vehicle_available():
            return jsonify({"error": "Vehicle already booked for selected dates"}), 409
        
        # calculate total amount
        days = (end_date - start_date).days + 1
        total_amount = days * vehicle.price_per_day

        booking = Booking(
            vehicle_id=vehicle_id,
            customer_id=customer_id,
            start_date=start_date,
            end_date=end_date,
            total_amount=total_amount,
            status="pending"
        )

        db.session.add(booking)
        db.session.commit()

        return jsonify({
            'message': 'Booking created succsessfully',
            'booking_id': booking.id,
            'status': booking.status,
            'total_amount': booking.total_amount
        }), 201
    
    except ValueError as e:
        return jsonify({'error': str(e)}), 400