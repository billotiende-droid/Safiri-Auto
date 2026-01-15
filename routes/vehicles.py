
from flask import request
from flask_restful import Resource
from server.models import Vehicle, db, Category, Owner

# GET and POST Requests
class VehicleList(Resource):

    # GET
    def get(self):
        category_id = request.args.get('category_id')
        status = request.args.get('status')

        query = Vehicle.query

        if category_id:
            query = query.filter_by(category_id=category_id)

        if status:
            query = query.filter_by(status=status)

        vehicles = query.all()

        response = []
        for v in vehicles:
            response.append({
                "owner_id": v.owner_id,
                "category_id": v.category_id,
                "registration_number": v.registration_number,
                "brand": v.brand,
                "model": v.model,
                "price_per_day": v.price_per_day,
                "status": v.status,
                "is_verified":is_verified
            })

        return response, 200


    # POST
    def post(self):
        data = request.get_json()

        required = [
            'owner_id', 'category_id',
            'registration_number', 'brand',
            'model', 'price_per_day'
        ]

        if not all(field in data for field in required):
            return {"error": "Missing required fields"}, 400

        owner = Owner.query.get(data['owner_id'])
        if not owner:
            return {"error": "Owner not found"}, 404

        category = Category.query.get(data['category_id'])
        if not category:
            return {"error": "Category not found"}, 404

        vehicle = Vehicle(
            owner_id=data['owner_id'],
            category_id=data['category_id'],
            registration_number=data['registration_number'],
            brand=data['brand'],
            model=data['model'],
            price_per_day=data['price_per_day'],
            status='available'
        )

        db.session.add(vehicle)
        db.session.commit()

        response = {
            "owner_id":vehicle.owner_id,
            "category_id":vehicle.category_id,
            "registration_number":vehicle.registration_number,
            "brand":vehicle.brand,
            "model":vehicle.model,
            "price_per_day":vehicle.price_per_day,
            "status":vehicle.status
        }

        return response, 201




# By GET, PATCH and DLETE by ID
class VehicleResource(Resource):

    def get(self, id):
        vehicle = Vehicle.query.get_or_404(id)

        response = {
            "owner_id":vehicle.owner_id,
            "category_id":vehicle.category_id,
            "registration_number":vehicle.registration_number,
            "brand":vehicle.brand,
            "model":vehicle.model,
            "price_per_day":vehicle.price_per_day,
            "status":vehicle.status
        }

        return response, 200

    def patch(self, id):
        vehicle = Vehicle.query.get_or_404(id)
        data = request.get_json()

        allowed_fields = [
            'category_id',
            'price_per_day',
            'status',
            'is_verified'
        ]

        for field in allowed_fields:
            if field in data:
                setattr(vehicle, field, data[field])

        db.session.commit()

        response = {
            "vehicle_id":vehicle.id,
            "category_id":vehicle.category_id,
            "price_per_day":vehicle.price_per_day,
            "status":vehicle.status,
            "is_verified":vehicle.is_verified
        }
        return response, 200

    def delete(self, id):
        vehicle = Vehicle.query.get_or_404(id)
        db.session.delete(vehicle)
        db.session.commit()
        return {"message": "Vehicle deleted"}, 200




# Toggle Vehicle Status 
class VehicleStatus(Resource):

    def patch(self, id):
        vehicle = Vehicle.query.get_or_404(id)

        # Toggle between available and inactive
        vehicle.status = (
            'inactive' if vehicle.status == 'available'
            else 'available'
        )

        db.session.commit()

        return {
            "id": vehicle.id,
            "status": vehicle.status
        }, 200
