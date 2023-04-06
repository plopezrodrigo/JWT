"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

api = Blueprint('api', __name__)

# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
@api.route("/token", methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    user = User.query.filter_by(email=email, password=password).first()
    if not user:
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=user.email)
    return jsonify({    "msg": "token creado",
                        "token": access_token, 
                    })



@api.route("/hello", methods=["GET"])
@jwt_required()
def get_hello():
    
    email = get_jwt_identity()
    dictionary = {
        "message": "hello world" + email
    }
    return jsonify(dictionary)    

@api.route('/signup', methods=['POST'])
def signup():
    data = request.json
    subs = False
    try:
        user = User.query.filter_by(email=data['email']).first()
        if user:
            return jsonify({"msg": "No se puede crear este usuario porque ya existe"}), 401
        else:
            user = User(email=data['email'], password=data['password'], is_active=False)
            db.session.add(user)
            db.session.commit()
    except Exception as e:
        db.session.rollback()
        message_error = str(e)
        return jsonify({"msg": "No se puede crear este usuario", "error": message_error}), 400
    return jsonify({"msg": "Usuario creado correctamente"}), 200
