from ..extensions import db
from .user import User

class Application(db.Model):
    __tablename__ = 'application'
    id = db.Column(db.String,primary_key=True )
    userid = db.Column(db.String, db.ForeignKey('user.userid'),nullable = False)
    company = db.Column(db.String,nullable = False)
    title = db.Column(db.String,nullable = False)
    location = db.Column(db.String,nullable = True)
    pay = db.Column(db.Float,nullable = True)
    job_link = db.Column(db.String, nullable = True)
    job_type = db.Column(db.Enum('Internship','New Grad'))
    notes = db.Column(db.Text, nullable = True)
    status = db.Column(db.Enum('Not Applied Yet','Waiting','Pending Interview','Completed Interview-Awaiting Offer','Offer accepted'))
    date = db.Column(db.Date, nullable = True)
