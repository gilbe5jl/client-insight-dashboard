from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'super-secret-key'

# Allow all origins and headers for local dev
CORS(app, resources={r"/api/*": {"origins": "*"}})

jwt = JWTManager(app)

users = {
    "admin": "password123"
}

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