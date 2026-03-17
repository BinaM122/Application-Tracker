from flask import Blueprint,request,jsonify
from .verification import token_required
from ..models.application import Application
from ..extensions import db
import nanoid
from datetime import date

applications_bp = Blueprint('applications', __name__,url_prefix='/api/applications')
@applications_bp.route('/', methods=['POST'])
#@token_required
def create_application():
    uid="test uid"

    data = request.get_json()
    uidcode = nanoid.generate(size=21)
    new_application = Application(id=uidcode,userid=uid,company=data['company'],title=data['title'],location=data['location'],pay=data['pay'],job_link=data['link'],job_type=data['job_type'],notes=data['notes'],status=data['status'],date=date.fromisoformat(data['date']) if data['date'] else None)
    db.session.add(new_application)
    db.session.commit()
    return jsonify(new_application.to_dict()),201

@applications_bp.route('/',methods=['GET'])
def get_application():
    uid = "test uid"
    applications = Application.query.filter_by(userid=uid).all()
    applications_list = [item.to_dict() for item in applications]


    return jsonify(applications_list),200

@applications_bp.route('/<id>',methods=['GET'])
def get_application_single(id):
    application = db.session.get(Application, id)
    if not application:
        return jsonify({'error': 'not found'}), 404
    uid = "test uid"
    db.session.get(Application, id)
    return jsonify(application.to_dict()),200

@applications_bp.route('/<id>',methods=['PATCH'])
def edit_application(id):
    application = db.session.get(Application, id)
    if not application:
        return jsonify({'error': 'not found'}), 404
    uid = "test uid"
    data = request.get_json()
    application.company = data.get('company', application.company)
    application.title = data.get('title', application.title)
    application.location = data.get('location', application.location)
    application.pay = data.get('pay', application.pay)
    application.job_link = data.get('job_link', application.job_link)
    application.job_type = data.get('job_type', application.job_type)
    application.notes = data.get('notes', application.notes)
    application.status = data.get('status',application.status)
    if data.get('date'):
        application.date = date.fromisoformat(data['date'])    
    db.session.commit()


    return jsonify(application.to_dict()),200

@applications_bp.route('/<id>',methods=['DELETE'])
def remove_application(id):
    application = db.session.get(Application, id)
    if not application:
        return jsonify({'error': 'not found'}), 404
    uid = "test uid"
    db.session.delete(application)
    db.session.commit()

    return '',204

