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

class Payments(Resource):
    def post(self):
        # Create a new payment record for a booking.
        # Payment starts as 'pending' and will be updated to 'paid' when completed.
        data = request.get_json()

        # Validate required fields
        if not data.get("booking_id"):
            return {"error": "booking_id is required"}, 400

        # Check if booking exists
        booking = Booking.query.get(data.get("booking_id"))
        if not booking:
            return {"error": "Booking not found"}, 404

        # Business rule: Only confirmed bookings can be paid
        if booking.status != "confirmed":
            return {
                "error": "Payment only allowed for confirmed bookings",
                "current_status": booking.status
            }, 400

        # Check if booking already has a payment (pending or paid)
        existing_payment = Payment.query.filter_by(booking_id=booking.id).first()
        
        if existing_payment:
            if existing_payment.payment_status == "paid":
                return {
                    "error": "Booking already has a successful payment",
                    "payment_id": existing_payment.id
                }, 400
            else:
                # Return existing pending payment
                return {
                    "message": "Payment already initiated",
                    **existing_payment.to_dict()
                }, 200

        # Get amount from booking total
        amount_paid = booking.total_amount

        # Calculate commission and owner amount
        commission, owner_amount = calculate_commission(amount_paid)

        # Create payment record with PENDING status
        payment = Payment(
            booking_id=booking.id,
            amount_paid=amount_paid,
            payment_method=data.get("payment_method", "mpesa"),
            platform_commission=commission,
            owner_amount=owner_amount,
            payment_status="pending",  # Starts as pending
            created_at=datetime.utcnow(),
        )

        db.session.add(payment)
        db.session.commit()

        # Return payment details
        response = payment.to_dict()
        response["message"] = "Payment initiated. Complete payment to confirm booking."

        return response, 201
    
    def get(self):
        # Get all payments with optional filtering
        # Optional: Filter by booking_id or payment_status
        booking_id = request.args.get("booking_id")
        status = request.args.get("status")

        query = Payment.query

        if booking_id:
            query = query.filter_by(booking_id=int(booking_id))
        
        if status:
            query = query.filter_by(payment_status=status)

        payments = query.all()
        return [payment.to_dict() for payment in payments], 200
    
