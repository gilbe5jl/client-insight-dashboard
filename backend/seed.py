from models import db, Customer, CustomerNote, Purchase
from faker import Faker
from app import app
import random
from datetime import datetime

fake = Faker()

with app.app_context():
    print("🧹 Dropping and recreating database...")
    db.drop_all()
    db.create_all()

    for _ in range(90):
        customer = Customer(
            name=fake.company(),
            region=random.choice(['North America', 'Europe', 'Asia-Pacific']),
            status=random.choice(['Active', 'Inactive']),
            revenue=round(random.uniform(50000, 1000000), 2),
        )
        db.session.add(customer)
        db.session.flush()  # ensures customer.id is available before committing

        # Add 1–3 random notes
        for _ in range(random.randint(1, 3)):
            note = CustomerNote(
                customer_id=customer.id,
                note=fake.sentence(nb_words=10),
                timestamp=fake.date_time_between(start_date='-1y', end_date='now')
            )
            db.session.add(note)

        # Add 2–5 random purchases
        for _ in range(random.randint(2, 5)):
            purchase = Purchase(
                customer_id=customer.id,
                date=fake.date_time_between(start_date='-2y', end_date='now'),
                amount=round(random.uniform(100, 10000), 2),
                item=fake.bs().title()
            )
            db.session.add(purchase)

    db.session.commit()
    print("✅ Seeded 90 customers with notes and purchase history.")