from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.String, unique=True)
    name = db.Column(db.String)
    region = db.Column(db.String)
    status = db.Column(db.String)
    revenue = db.Column(db.Float)
    satisfaction_score = db.Column(db.Float)
    purchases = db.Column(db.Integer)
    avg_spend = db.Column(db.Float)