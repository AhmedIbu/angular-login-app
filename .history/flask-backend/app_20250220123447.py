from datetime import timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
from flask_jwt_extended import (
    create_access_token, jwt_required, JWTManager, get_jwt_identity
)
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# ✅ Enable CORS (Allow Angular frontend)
CORS(app, supports_credentials=True)

# ✅ MySQL Database Configuration
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "root",
    "database": "FlaskAppDB"
}

def connect_db():
    """ Establish and return a database connection. """
    return mysql.connector.connect(**db_config)

# ✅ JWT Secret Key & Expiry
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=3)
jwt = JWTManager(app)

# ✅ Predefined Admin Credentials
ADMIN_CREDENTIALS = {
    "email": "ibrahim.offl24@gmail.com",
    "password": "root123"
}

# ✅ Test Route
@app.route('/', methods=['GET'])
def index():
    return "Flask API is running!"

# ✅ User Registration
@app.route('/register', methods=['POST'])
def register():
    """ Registers a new user into the database. """
    try:
        data = request.get_json()  # ✅ Ensure data is properly retrieved
                 print("📩 Received Data:", data)

            if not data:
            return jsonify({"message": "No data received"}), 400
        

        name = data.get("name")
        email = data.get("email")
        phonenum = data.get("phone")
        address = data.get("address")
        password = data.get("password")

        if not name or not email or not phonenum or not address or not password:
            return jsonify({"message": "All fields are required"}), 400

        hashed_password = generate_password_hash(password)

        conn = connect_db()
        cursor = conn.cursor()

        # ✅ Check if email already exists
        cursor.execute("SELECT email FROM users WHERE email = %s", (email,))
        existing_user = cursor.fetchone()
        if existing_user:
            cursor.close()
            conn.close()
            return jsonify({"message": "Email already registered"}), 400

        # ✅ Insert new user
        cursor.execute(
            "INSERT INTO users (name, email, phone, address, password) VALUES (%s, %s, %s, %s, %s)", 
            (name, email, phonenum, address, hashed_password)
        )
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        print("❌ Registration error:", str(e))
        return jsonify({"message": "Registration failed", "error": str(e)}), 500

# ✅ User/Admin Login (Generates JWT Token)
@app.route("/login", methods=["POST"])
def login():
    """ Authenticates a user and generates a JWT token. """
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # ✅ Check if Admin is Logging In
        if email == ADMIN_CREDENTIALS["email"] and password == ADMIN_CREDENTIALS["password"]:
            token = create_access_token(identity="admin")
            return jsonify({'token': token, 'isAdmin': True})

        conn = connect_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user and check_password_hash(user['password'], password):
            token = create_access_token(identity=user['email'])
            return jsonify({'token': token, 'isAdmin': False})
        else:
            return jsonify({'message': 'Invalid Credentials'}), 401

    except Exception as e:
        return jsonify({"message": "Login failed", "error": str(e)}), 500

# ✅ Admin-Only Route: Fetch All Users
@app.route('/get-users-data', methods=['GET'])
@jwt_required()
def get_users_data():
    """ Fetches all users (Admin Only). """
    current_user = get_jwt_identity()

    if current_user != "admin":
        return jsonify({"message": "Unauthorized"}), 403

    try:
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, name, email, phone, address FROM users")  # ✅ Fixed phonenum issue
        users = cursor.fetchall()
        cursor.close()
        conn.close()

        return jsonify(users), 200

    except Exception as e:
        return jsonify({"error": "Failed to fetch users", "message": str(e)}), 500

# ✅ User Data Submission (Requires JWT)
@app.route('/submit-form', methods=['POST'])
@jwt_required()
def submit_form():
    """ Allows a logged-in user to submit form data. """
    try:
        data = request.get_json()
        email = get_jwt_identity()

        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO user_data (email, name, phone, address) VALUES (%s, %s, %s, %s)",
            (email, data.get("name"), data.get("phone"), data.get("address"))
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "User data saved successfully!"}), 201

    except Exception as e:
        return jsonify({"message": "Data submission failed", "error": str(e)}), 500

# ✅ Retrieve User Data (Requires JWT)
@app.route('/get-all-users-data', methods=['GET'])
@jwt_required()
def get_all_users_data():
    """ Retrieves data for all users (Admin sees all, Users see their own). """
    current_user = get_jwt_identity()

    try:
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)

        if current_user == "admin":
            cursor.execute("SELECT * FROM user_data")
        else:
            cursor.execute("SELECT * FROM user_data WHERE email = %s", (current_user,))

        users = cursor.fetchall()
        cursor.close()
        conn.close()

        return jsonify(users), 200

    except Exception as e:
        return jsonify({"message": "Error retrieving user data", "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
