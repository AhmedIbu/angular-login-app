from datetime import timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, JWTManager, get_jwt_identity
import sqlite3
import my
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# ✅ Configure CORS (Allow Angular frontend)
CORS(app)

db_config = {
    'host': 'localhost',   # Change if MySQL is hosted elsewhere
    'user': 'your_username',  # Replace with your MySQL username
    'password': 'your_password',  # Replace with your MySQL password
    'database': 'FlaskAppDB'  # Use the database you created
}

def connect_db():
    return sqlite3.connect("user.db")


# ✅ JWT Secret Key & Expiry
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=3)
jwt = JWTManager(app)

# ✅ In-Memory Storage (Temporary)
users = []  # Stores registered users
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
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"message": "All fields are required"}), 400

    hashed_password = generate_password_hash(password)

    try:
        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", 
                       (name, email, hashed_password))
        conn.commit()
        conn.close()
        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        return jsonify({"message": "Registration failed", "error": str(e)}), 500

# ✅ User Login (Generates JWT Token)
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    # ✅ Check if Admin is Logging In
    if data['email'] == ADMIN_CREDENTIALS["email"] and data['password'] == ADMIN_CREDENTIALS["password"]:
        token = create_access_token(identity="admin")  
        return jsonify({'token': token})

    # ✅ Check Regular Users with Hashed Password
    for user in users:
        if user['email'] == data['email'] and check_password_hash(user['password'], data['password']):
            token = create_access_token(identity=user['email'])  
            return jsonify({'token': token})

    return jsonify({'message': 'Invalid Credentials'}), 401


# ✅ Admin-Only Route: Fetch All Users
@app.route('/get-users', methods=['GET'])
@jwt_required()
def get_users():
    current_user = get_jwt_identity()

    if current_user != "admin":
        return jsonify({"message": "Unauthorized"}), 403

    return jsonify(users), 200  

# ✅ User Data Submission (Requires JWT)
@app.route('/submit-form', methods=['POST'])
@jwt_required()
def submit_form():
    data = request.get_json()
    user_data.append(data)
    return jsonify({"message": "User data saved successfully!"}), 201

# ✅ Retrieve User Data (Requires JWT)
@app.route('/get-users-data', methods=['GET'])
@jwt_required()
def get_users_data():
    current_user = get_jwt_identity()

    # ✅ Only Admin Can View All Users
    if current_user == "admin":
        return jsonify(user_data), 200

    # ✅ Regular Users Should See Only Their Own Data
    user_entries = [entry for entry in user_data if entry.get("email") == current_user]
    return jsonify(user_entries), 200

if __name__ == '__main__':
    app.run(debug=True)
