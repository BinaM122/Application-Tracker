from flask import Blueprint,request,jsonify
from .verification import token_required
from ..models.application import Application
from ..extensions import db
import nanoid
from datetime import date

applications_bp = Blueprint('applications', __name__,url_prefix='/api/applications')
@applications_bp.route('/', methods=['POST'])
@token_required
def create_application(uid):

    data = request.get_json()
    uidcode = nanoid.generate(size=21)
    pay = float(str(data['pay']).replace(',', '')) if data.get('pay') else None
    new_application = Application(id=uidcode,userid=uid,company=data['company'],title=data['title'],location=data['location'],pay=pay,job_link=data['link'],job_type=data['job_type'],notes=data['notes'],status=data['status'],date=date.fromisoformat(data['date']) if data['date'] else None)
    db.session.add(new_application)
    db.session.commit()
    return jsonify(new_application.to_dict()),201

@applications_bp.route('/',methods=['GET'])
@token_required
def get_application(uid):
    applications = Application.query.filter_by(userid=uid).all()
    applications_list = [item.to_dict() for item in applications]


    return jsonify(applications_list),200

@applications_bp.route('/<id>',methods=['GET'])
@token_required
def get_application_single(uid, id):
    application = db.session.get(Application, id)
    if not application:
        return jsonify({'error': 'not found'}), 404
    return jsonify(application.to_dict()),200

@applications_bp.route('/<id>',methods=['PATCH'])
@token_required
def edit_application(uid, id):
    application = db.session.get(Application, id)
    if not application:
        return jsonify({'error': 'not found'}), 404
    data = request.get_json()
    application.company = data.get('company', application.company)
    application.title = data.get('title', application.title)
    application.location = data.get('location', application.location)
    raw_pay = data.get('pay')
    application.pay = float(str(raw_pay).replace(',', '')) if raw_pay else application.pay
    application.job_link = data.get('job_link', application.job_link)
    application.job_type = data.get('job_type', application.job_type)
    application.notes = data.get('notes', application.notes)
    application.status = data.get('status',application.status)
    if data.get('date'):
        application.date = date.fromisoformat(data['date'])    
    db.session.commit()


    return jsonify(application.to_dict()),200

@applications_bp.route('/<id>',methods=['DELETE'])
@token_required
def remove_application(uid, id):
    application = db.session.get(Application, id)
    if not application:
        return jsonify({'error': 'not found'}), 404
    db.session.delete(application)
    db.session.commit()

    return '',204

