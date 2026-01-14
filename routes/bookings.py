from flask_restful import Resource
from flask import request
from datetime import datetime

from server.models import db, Booking, Vehicle


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

# Total rental cost formula
def calculate_total_cost(vehicle, start_date, end_date):
        days = (end_date - start_date).days + 1
        return days * vehicle.price_per_day



# GET & POST for Booking Resource

class BookingListResource(Resource):
    
    def get(self):
        bookings = Booking.query.all()
        return [booking.to_dict() for booking in bookings], 200
    
    def post(self):
    
        data = request.get_json()

        vehicle_id = data.get('vehicle_id')
        start_date = parse_date(data.get('start_date'))
        end_date = parse_date(data.get('end_date'))

        if not all([vehicle_id, start_date, end_date]):
            return {'error': 'vehicle_id, start_date and end_date are required'}, 400
        
        if start_date > end_date:
            return {'error': 'Start date cannot be after end date'}, 400
        
        vehicle = Vehicle.query.get(vehicle_id)
        if not vehicle:
            return {'error': 'Vehicle not found'}, 404
        
        if not is_vehicle_available(vehicle_id, start_date, end_date):
            return {'error': 'Vehicle is not available for the selected dates'}, 400
        
        total_cost = calculate_total_cost(vehicle, start_date, end_date)

        booking = Booking(
            vehicle_id=vehicle_id,
            start_date=start_date,
            end_date=end_date,
            total_cost=total_cost,
            status='confirmed'
        )

        vehicle.status = 'booked'

        db.session.add(booking)
        db.session.commit()

        return booking.to_dict(), 201
    

# GET, PATCH, DELETE booking by ID 
class BookingResource(Resource):
    
    def get(self, id):
        booking = Booking.query.get(id)
        if not booking:
            return {'error': 'Booking not found'}, 404
        
        return booking.to_dict(), 200
    
    def patch(self, id):
        booking = Booking.query.get(id)
        if not booking:
            return {'error': 'Booking not found'}, 404
        
        if booking.status in ['cancelled', 'completed']:
            return {'error': 'This booking cannot be modified'}, 400
        
        data = request.get_json()
        new_status = data.get('status')

        if new_status not in ["confirmed", "cancelled", "completed"]:
            return {'error': 'Invalid status value'}, 400
        
        booking.status = new_status

        if new_status == 'cancelled':
            vehicle = Vehicle.query.get(booking.vehicle_id)
            if vehicle:
                vehicle.status = 'available'

        db.session.commit()
        return booking.to_dict(), 200
    
    def delete(self, id):
        booking = Booking.query.get(id)
        if not booking:
            return {'error': 'Booking not found'}, 404
        
        db.session.delete(booking)
        db.session.commit()

        return {'Booking deleted successfully'}, 200