from ..extensions import db

class User(db.Model):
    __tablename__ = 'user'
    userid = db.Column(db.String,primary_key=True )
    email = db.Column(db.String, nullable=False, unique=True)
