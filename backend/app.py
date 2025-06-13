from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from models import db, Customer, CustomerNote, Purchase
from datetime import datetime
from collections import defaultdict

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///customers.db'
app.config['JWT_SECRET_KEY'] = 'super-secret-key'

# Allow all origins and headers for local dev
CORS(app, resources={r"/api/*": {"origins": "*"}})
db.init_app(app)

jwt = JWTManager(app)

users = {
    "admin": "password123"
}


@app.route("/api/sales_summary", methods=["GET"])
def sales_summary():
    summary = defaultdict(float)
    for purchase in Purchase.query.all():
        label = purchase.date.strftime("%b %Y")
        summary[label] += purchase.amount

    # sort by date label
    sorted_items = sorted(summary.items(), key=lambda x: datetime.strptime(x[0], "%b %Y"))
    return jsonify([{ "month": k, "revenue": round(v, 2) } for k, v in sorted_items])


@app.route('/api/customers/<int:customer_id>/notes', methods=['GET', 'POST'])
def handle_notes(customer_id):
    if request.method == 'GET':
        notes = CustomerNote.query.filter_by(customer_id=customer_id).all()
        return jsonify([{
            'id': n.id,
            'note': n.note,
            'timestamp': n.timestamp.isoformat()
        } for n in notes])

    if request.method == 'POST':
        data = request.get_json()
        note = CustomerNote(customer_id=customer_id, note=data['note'])
        db.session.add(note)
        db.session.commit()
        return jsonify({
            'id': note.id,
            'note': note.note,
            'timestamp': note.timestamp.isoformat()
        })

@app.route('/api/customers/<int:customer_id>/purchases')
def handle_purchases(customer_id):
    purchases = Purchase.query.filter_by(customer_id=customer_id).all()
    return jsonify([{
        'id': p.id,
        'date': p.date.isoformat(),
        'amount': p.amount,
        'item': p.item
    } for p in purchases])

from flask import request
from models import Customer, db

@app.route("/api/customers", methods=["POST"])
def create_customer():
    data = request.get_json()

    # Basic validation
    required_fields = ["name", "region", "revenue", "status"]
    for field in required_fields:
        if field not in data or not str(data[field]).strip():
            return {"error": f"'{field}' is required."}, 400

    # try:
    #     # revenue = float(data["revenue"])

    #     if revenue < 0:
    #         return {"error": "Revenue must be a positive number."}, 400
    # except ValueError:
    #     return {"error": "Revenue must be a number."}, 400
    revenue_raw = data.get("revenue")
    if revenue_raw is None:
        return {"error": "Revenue is required."}, 400
    try:
        revenue = float(revenue_raw)
        if revenue < 0:
            return {"error": "Revenue must be a positive number."}, 400
    except (ValueError, TypeError):
        return {"error": "Revenue must be a valid number."}, 400

    # Create and commit
    new_customer = Customer(
        name=data["name"].strip(),
        region=data["region"].strip(),
        revenue=revenue,
        status=data["status"].strip()
    )

    db.session.add(new_customer)
    db.session.commit()

    return {
        "id": new_customer.id,
        "name": new_customer.name,
        "region": new_customer.region,
        "revenue": new_customer.revenue,
        "status": new_customer.status
    }, 201





@app.route("/api/metrics", methods=["GET"])
def get_metrics():
    """
    Returns key business metrics for the dashboard UI.

    - total_customers: Count of all customer records in the database.
    Useful for tracking user base growth.

    - monthly_revenue: Sum of all purchases made during the current calendar month.
    Calculated by filtering purchases where the purchase date falls within the current month and year.
    Helps track recent sales performance.
    The total dollar amount of all purchases made in the current calendar month
    - avg_spend: Average amount spent per purchase across all customers.
    Calculated as the total sum of all purchase amounts divided by the number of purchases.
    Useful for understanding typical purchase value and customer behavior.
    """
    total_customers = Customer.query.count()

    current_month = datetime.now().month
    current_year = datetime.now().year
    monthly_revenue = db.session.query(db.func.sum(Purchase.amount)) \
        .filter(db.extract('month', Purchase.date) == current_month) \
        .filter(db.extract('year', Purchase.date) == current_year) \
        .scalar() or 0

    all_purchases = Purchase.query.all()
    total_revenue = sum(p.amount for p in all_purchases)
    avg_spend = total_revenue / len(all_purchases) if all_purchases else 0

    return jsonify({
        "total_customers": total_customers,
        "monthly_revenue": round(monthly_revenue, 2),
        "avg_spend": round(avg_spend, 2),
    }), 200

@app.route("/api/customers", methods=["GET"])
def get_customers():
    customers = Customer.query.all()
    result = [
        {
            "id": c.id,
            "name": c.name,
            "region": c.region,
            "status": c.status,
            "revenue": c.revenue,
            # "satisfactionScore": c.satisfaction_score,
            # "metrics": {
                # "purchases": c.purchases,
                # "avgSpend": c.avg_spend
            # }
        } for c in customers
    ]
    return jsonify(result), 200

@app.route("/api/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        return '', 200  # CORS preflight bypass

    try:
        data = request.get_json(force=True)
        username = data.get("username")
        password = data.get("password")
    except Exception as e:
        print("Login parsing error:", e)
        return jsonify(msg="Bad request"), 400

    if users.get(username) == password:
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200
    return jsonify(msg="Invalid credentials"), 401

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)