from models import db, Customer
from faker import Faker
from app import app
import random

fake = Faker()

with app.app_context():
    db.drop_all()
    db.create_all()

    for _ in range(90):
        c = Customer(
            customer_id=fake.unique.bothify(text='CUST####'),
            name=fake.company(),
            region=random.choice(['North America', 'Europe', 'Asia-Pacific']),
            status=random.choice(['Active', 'Inactive']),
            revenue=round(random.uniform(50000, 1000000), 2),
            satisfaction_score=round(random.uniform(3.0, 5.0), 1),
            purchases=random.randint(5, 100),
            avg_spend=round(random.uniform(1000, 50000), 2)
        )
        db.session.add(c)
    db.session.commit()