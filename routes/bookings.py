from flask import Blueprint, request, jsonify
from datetime import datetime

from server.models import db, Booking, Vehicle

bookings_bp = Blueprint('bookings', __name__)

# Logic to parse date
def parse_date(value, field_name):
    try:
        return datetime.fromisoformat(value).date()
    except Exception:
        raise ValueError(f'Invalid date format for {field_name}. Use YYYY-MM-DD')

# Logic to check vehicle availability
def is_vehicle_available(vehicle_id, start_date, end_date):
    conflicting_booking = Booking.query.filter(
        Booking.vehicle_id == vehicle_id,
        Booking.status == 'confirmed',
        Booking.start_date <= end_date,
        Booking.end_date >= start_date
    ).first()

    return conflicting_booking is None

# POST for Booking (POST /bookings)
@bookings_bp.route('/bookings', methods=['POST'])
def create_booking():
    
    data = request.get_json()

    try:
        vehicle_id = data.get('vehicle_id')
        customer_id = data.get('customer_id')

        start_date = parse_date(data.get('start_date'), 'start_date')
        end_date = parse_date(data.get('end_date'), 'end_date')

        if start_date > end_date:
            return jsonify({'error': 'Start date cannot be after end date'}), 400
        
        vehicle = Vehicle.query.get(vehicle_id)
        if not vehicle:
            return jsonify({'error': 'Vehicle not found'}), 404
        
        if vehicle.status != 'available':
            return jsonify({'error': 'Vehicle not available'}), 400
        
        if not is_vehicle_available():
            return jsonify({'error': 'Vehicle already booked for selected dates'}), 409
        
        # calculate total amount
        days = (end_date - start_date).days + 1
        total_amount = days * vehicle.price_per_day

        booking = Booking(
            vehicle_id=vehicle_id,
            customer_id=customer_id,
            start_date=start_date,
            end_date=end_date,
            total_amount=total_amount,
            status='pending'
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
    

# GET booking by ID (View customer's bookings: GET /bookings/<id>)
@bookings_bp.route('users/<int:user_id>/bookings', methods=['GET'])
def get_user_bookings(user_id):
    bookings = Booking.query.filter_by(customer_id=user_id).order_by(Booking.start_date.desc()).all()

    result = []

    for booking in bookings:
        result.append({
            'id': booking.id,
            'vehicle_id': booking.vehicle_id,
            'start_date': booking.start_date.isoformat(),
            'end_date': booking.end_date.isoformat(),
            'status': booking.status,
            'total_amount': booking.total_amount
        })

    return jsonify(result), 200


# PATCH for bookings (Cancel booking: /bookings/<id>/cancel)
def cancel_booking(booking_id):
    booking = Booking.query.get(booking_id)

    if not booking:
        return jsonify({'error': 'Booking not found'}), 404
    
    if booking.status == 'completed':
        return jsonify({'error': 'Completed bookings cannot be cancelled'}), 400
    
    booking.status = 'cancelled'

    vehicle = Vehicle.query.get(booking.vehicle_id)
    if vehicle:
        vehicle.status = 'available'

    db.session.commit()

    return jsonify({
        'message': 'Booking cancelled successfully',
        'booking_id': booking.id
    }), 200