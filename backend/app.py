from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from models import db, Customer

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


@app.route("/api/customers", methods=["GET"])
def get_customers():
    customers = Customer.query.all()
    result = [
        {
            "id": c.customer_id,
            "name": c.name,
            "region": c.region,
            "status": c.status,
            "revenue": c.revenue,
            "satisfactionScore": c.satisfaction_score,
            "metrics": {
                "purchases": c.purchases,
                "avgSpend": c.avg_spend
            }
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