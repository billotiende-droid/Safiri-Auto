from flask import request
from flask_restful import Resource
from models import db, Category
from flask_cors import cross_origin


# GET and POST for Categories
class CategoryList(Resource):

    @cross_origin(origins="http://localhost:3000", supports_credentials=True)
    # GET
    def get(self):
        categories = Category.query.all()

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
            "category_id": category.id,
            "name": category.name,
        }

        return response, 201
