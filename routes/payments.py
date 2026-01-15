from flask_restful import Resource
from flask import request
from server.models import db, Payment, Booking
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

class PaymentsResource(Resource):
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
        response_message = {
        "id": payment.id,
        "booking_id": payment.booking_id,
        "amount_paid": payment.amount_paid,
        "payment_status": payment.payment_status,
        "payment_method": payment.payment_method,
        }
        response_message["message"] = "Payment initiated. Complete payment to confirm booking."

        return response_message, 201
    
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

        response_message = [
            {
            "id": payment.id,
            "booking_id": payment.booking_id,
            "amount_paid": payment.amount_paid,
            "payment_status": payment.payment_status,
            "payment_method": payment.payment_method,
            }
            for payment in payments 
        ]
        return response_message, 200
    
class PaymentByID(Resource):

    def get(self, id):
        # Get a specific payment by ID
        payment = Payment.query.get(id)

        if not payment:
            return {"error": "Payment not found"}, 404
        
        response_message = {
        "id": payment.id,
        "booking_id": payment.booking_id,
        "amount_paid": payment.amount_paid,
        "payment_status": payment.payment_status,
        "payment_method": payment.payment_method,
        }

        return response_message, 200
    
    
    def patch(self, id):
        # Update payment status and complete payment.
        # Used to mark payment as 'paid' after user completes payment in frontend.
        
        payment = Payment.query.get(id)

        if not payment:
            return {"error": "Payment not found"}, 404

        data = request.get_json()
        
        # Validate amount if provided (must match original)
        if "amount_paid" in data:
            if int(data["amount_paid"]) != payment.amount_paid:
                return {
                    "error": "Amount does not match payment record",
                    "expected": payment.amount_paid,
                    "received": int(data["amount_paid"])
                }, 400
        
        # Update payment status
        if "payment_status" in data:
            valid_statuses = ["pending", "paid", "failed"]
            new_status = data["payment_status"]
            
            if new_status not in valid_statuses:
                return {
                    "error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
                }, 400
            
            old_status = payment.payment_status
            payment.payment_status = new_status
            
            # If payment is marked as paid, update booking status
            if new_status == "paid" and old_status != "paid":
                booking = Booking.query.get(payment.booking_id)
                if booking:
                    booking.status = "paid"
            
            db.session.commit()
            
            # Generate payment reference for successful payments
            response_message = {
            "id": payment.id,
            "booking_id": payment.booking_id,
            "amount_paid": payment.amount_paid,
            "payment_status": payment.payment_status,
            "payment_method": payment.payment_method,
            }
            if new_status == "paid":
                response_message["payment_reference"] = generate_payment_ref()
                response_message["message"] = "Payment completed successfully"
            
            return response_message, 200
        
        return {"error": "No valid fields to update"}, 400
    