from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from models import db, Customer, CustomerNote, Purchase
from datetime import datetime

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