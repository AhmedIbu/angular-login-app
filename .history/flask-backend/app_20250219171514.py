from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, JWTManager, get_jwt_identity

app = Flask(__name__)

# ✅ Configure CORS (Allow Angular frontend)
CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})

# ✅ JWT Secret Key
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta
jwt = JWTManager(app)

# ✅ In-Memory Storage (Temporary)
users = []  # Stores user credentials
user_data = []  # Stores user-submitted form data

# ✅ Predefined Admin Credentials
ADMIN_CREDENTIALS = {
    "email": "ibrahim.offl24@gmail.com",
    "password": "root123"
}

# ✅ Test Route
@app.route('/', methods=['GET'])
def index():
    return "Flask API is running!"

# ✅ Register User
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    users.append(data)
    return jsonify({'message': 'User Registered Successfully'}), 201

# ✅ User Login (Generates JWT Token)
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    
    # ✅ Check Admin Login
    if data['email'] == ADMIN_CREDENTIALS['email'] and data['password'] == ADMIN_CREDENTIALS['password']:
        token = create_access_token(identity="admin")
        return jsonify({'token': token, 'role': 'admin'}), 200

    # ✅ Check Regular User Login
    for user in users:
        if user['email'] == data['email'] and user['password'] == data['password']:
            token = create_access_token(identity=user['email'])
            return jsonify({'token': token, 'role': 'user'}), 200

    return jsonify({'message': 'Invalid Credentials'}), 401

# ✅ Admin-Only Route: Fetch All Users (Requires Admin JWT)
@app.route('/get-users', methods=['GET'])
@jwt_required()
def get_users():
    current_user = get_jwt_identity()
    
    if current_user != "admin":
        return jsonify({"message": "Unauthorized"}), 403

    return jsonify(users), 200  # Return all stored users

# ✅ User Data Submission (Requires JWT)
@app.route('/submit-form', methods=['POST'])
@jwt_required()
def submit_form():
    data = request.get_json()
    user_data.append(data)
    return jsonify({"message": "User data saved Successfully!"}), 201

# ✅ Retrieve User Data (Requires JWT)
@app.route('/get-users-data', methods=['GET'])
@jwt_required()
def get_users_data():
    return jsonify(user_data), 200

if __name__ == '__main__':
    app.run(debug=True)
