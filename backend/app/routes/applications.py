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
