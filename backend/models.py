from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    region = db.Column(db.String(50))
    revenue = db.Column(db.Float)
    status = db.Column(db.String(20))
    join_date = db.Column(db.DateTime, default=datetime.utcnow)

    notes = db.relationship('CustomerNote', backref='customer', lazy=True)
    purchases = db.relationship('Purchase', backref='customer', lazy=True)

class CustomerNote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'))
    note = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class Purchase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'))
    date = db.Column(db.DateTime, default=datetime.utcnow)
    amount = db.Column(db.Float, nullable=False)
    item = db.Column(db.String(100))