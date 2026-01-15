
from flask import request
from flask_restful import Resource
from server.models import db, Category


# GET and POST for Categories
class CategoryList(Resource):

    # GET
    def get(self):
        categories = Category.query.all()
        return [c.to_dict() for c in categories], 200

        response = []
        for c in categories:
            response.append({
                "category_id": c.id,
                "name": c.name,
            })

        return response, 200

    # POST
    def post(self):
        data = request.get_json()

        if not data or not data.get('name'):
            return {"error": "Category name is required"}, 400

        if Category.query.filter_by(name=data['name']).first():
            return {"error": "Category already exists"}, 409

        category = Category(name=data['name'])
        db.session.add(category)
        db.session.commit()

        response = {
            "category_id":category.id,
            "category_id":category.name,
        }

        return response, 201
