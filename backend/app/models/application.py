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
    def to_dict(self):
        return {
            'id': self.id,
            'company': self.company,
            'title':self.title,
            'location':self.location,
            'pay':self.pay,
            'job_link':self.job_link,
            'job_type':self.job_type,
            'notes':self.notes,
            'status':self.status,
            'date': self.date.isoformat() if self.date else None

        }
