from flask_restful import Resource
from flask import request
from datetime import datetime
from flask_cors import cross_origin

from models import db, Booking, Vehicle, User


# Logic to parse date/time (expect ISO format)
def parse_date(value, field_name):
    try:
        return datetime.fromisoformat(value)
    except Exception:
        raise ValueError(f'Invalid date format for {field_name}. Use YYYY-MM-DD or ISO format')

# Logic to check vehicle availability
def is_vehicle_available(vehicle_id, start_date, end_date):
    conflicting_booking = Booking.query.filter(
        Booking.vehicle_id == vehicle_id,
        Booking.status == 'confirmed',
        Booking.start_date <= end_date,
        Booking.end_date >= start_date
    ).first()

    return conflicting_booking is None

# Total rental cost formula
def calculate_total_amount(vehicle, start_date, end_date):
    days = (end_date - start_date).days + 1
    return days * vehicle.price_per_day


# GET & POST for Booking Resource
class BookingListResource(Resource):

    @cross_origin(origins="http://localhost:3000", supports_credentials=True)
    def get(self):
        bookings = Booking.query.all()

        response = []
        for booking in bookings:
            vehicle = booking.vehicle
            response.append({
                'id': booking.id,
                'vehicle_id': booking.vehicle_id,
                'vehicle': {
                    'id': vehicle.id,
                    'registration_number': vehicle.registration_number,
                    'brand': vehicle.brand,
                    'model': vehicle.model
                } if vehicle else None,
                'customer_id': booking.customer_id,
                'customer_name': booking.customer.name if booking.customer else None,
                'start_date': booking.start_date.isoformat(),
                'end_date': booking.end_date.isoformat(),
                'total_amount': booking.total_amount,
                'status': booking.status
            })

        return response, 200

    def post(self):
        data = request.get_json() or {}

        vehicle_id = data.get('vehicle_id')
        customer_id = data.get('customer_id')

        try:
            start_date = parse_date(data.get('start_date'), 'start_date')
            end_date = parse_date(data.get('end_date'), 'end_date')
        except ValueError as e:
            return {'error': str(e)}, 400

        if not all([vehicle_id, customer_id, start_date, end_date]):
            return {'error': 'vehicle_id, customer_id, start_date and end_date are required'}, 400

        if start_date > end_date:
            return {'error': 'Start date cannot be after end date'}, 400

        vehicle = Vehicle.query.get(vehicle_id)
        if not vehicle:
            return {'error': 'Vehicle not found'}, 404

        user = User.query.get(customer_id)
        if not user:
            return {'error': 'Customer not found'}, 404

        if not is_vehicle_available(vehicle_id, start_date, end_date):
            return {'error': 'Vehicle is not available for the selected dates'}, 409

        total_amount = calculate_total_amount(vehicle, start_date, end_date)

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

        response = {
            'id': booking.id,
            'vehicle_id': booking.vehicle_id,
            'vehicle': {
                'id': vehicle.id,
                'registration_number': vehicle.registration_number,
                'brand': vehicle.brand,
                'model': vehicle.model
            } if vehicle else None,
            'customer_id': booking.customer_id,
            'customer_name': booking.customer.name if booking.customer else None,
            'start_date': booking.start_date.isoformat(),
            'end_date': booking.end_date.isoformat(),
            'total_amount': booking.total_amount,
            'status': booking.status
        }

        return response, 201


# GET, PATCH, DELETE booking by ID
class BookingResource(Resource):

    @cross_origin(origins="http://localhost:3000", supports_credentials=True)
    def get(self, id):
        booking = Booking.query.get(id)
        if not booking:
            return {'error': 'Booking not found'}, 404

        vehicle = booking.vehicle
        response = {
            'id': booking.id,
            'vehicle_id': booking.vehicle_id,
            'vehicle': {
                'id': vehicle.id,
                'registration_number': vehicle.registration_number,
                'brand': vehicle.brand,
                'model': vehicle.model
            } if vehicle else None,
            'customer_id': booking.customer_id,
            'customer_name': booking.customer.name if booking.customer else None,
            'start_date': booking.start_date.isoformat(),
            'end_date': booking.end_date.isoformat(),
            'total_amount': booking.total_amount,
            'status': booking.status
        }

        return response, 200

    def patch(self, id):
        booking = Booking.query.get(id)
        if not booking:
            return {'error': 'Booking not found'}, 404

        data = request.get_json()
        new_status = data.get('status')

        allowed_transitions = {
            'pending': ['confirmed', 'cancelled'],
            'confirmed': ['completed', 'cancelled'],
            'completed': [],
            'cancelled': []
        }

        if new_status not in allowed_transitions.get(booking.status, []):
            return {'error': f'Cannot change status from {booking.status} to {new_status}'}, 400

        vehicle = Vehicle.query.get(booking.vehicle_id)

        # If marking completed, remove booking and free vehicle
        if new_status == 'completed':
            if vehicle:
                vehicle.status = 'available'
            db.session.delete(booking)
            db.session.commit()
            return {'message': 'Booking completed and cleared', 'vehicle_id': vehicle.id if vehicle else None}, 200

        # Otherwise update status and vehicle state
        booking.status = new_status

        if new_status == 'confirmed' and vehicle:
            vehicle.status = 'booked'

        if new_status in ['cancelled'] and vehicle:
            vehicle.status = 'available'

        db.session.commit()
        vehicle = Vehicle.query.get(booking.vehicle_id)
        return {
            'id': booking.id,
            'vehicle_id': booking.vehicle_id,
            'vehicle': {
                'id': vehicle.id,
                'registration_number': vehicle.registration_number,
                'brand': vehicle.brand,
                'model': vehicle.model
            } if vehicle else None,
            'customer_id': booking.customer_id,
            'customer_name': booking.customer.name if booking.customer else None,
            'start_date': booking.start_date.isoformat(),
            'end_date': booking.end_date.isoformat(),
            'total_amount': booking.total_amount,
            'status': booking.status
        }, 200

    def delete(self, id):
        booking = Booking.query.get(id)
        if not booking:
            return {'error': 'Booking not found'}, 404

        vehicle = Vehicle.query.get(booking.vehicle_id)
        if vehicle:
            vehicle.status = 'available'

        db.session.delete(booking)
        db.session.commit()

        return {'message': 'Booking deleted successfully'}, 200
