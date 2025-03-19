from datetime import timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
from flask_jwt_extended import create_access_token, jwt_required, JWTManager, get_jwt_identity
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# ✅ Configure CORS (Allow Angular frontend)
CORS(app)

# ✅ MySQL Database Configuration
db = mysql.connector.connect(
    'host'= 'localhost',
    'user'= 'root',  # Change this
    'password'= 'root',  # Change this
    'database'= 'FlaskAppDB'  # Change this
)

def connect_db():
    return mysql.connector.connect(**db)

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
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # ✅ Check if email already exists
        cursor.execute("SELECT email FROM users WHERE email = %s", (email,))
        existing_user = cursor.fetchone()
        if existing_user:
            return jsonify({"message": "Email already registered"}), 400

        # ✅ Insert new user
        cursor.execute("INSERT INTO users (name, email, password) VALUES (%s, %s, %s)", 
                       (name, email, hashed_password))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        return jsonify({"message": "Registration failed", "error": str(e)}), 500


# ✅ User Login (Generates JWT Token)
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    # ✅ Check if Admin is Logging In
    if email == ADMIN_CREDENTIALS["email"] and password == ADMIN_CREDENTIALS["password"]:
        token = create_access_token(identity="admin")
        return jsonify({'token': token})

    # ✅ Check Regular Users
    try:
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        conn.close()

        if user and check_password_hash(user['password'], password):
            token = create_access_token(identity=user['email'])
            return jsonify({'token': token})

        return jsonify({'message': 'Invalid Credentials'}), 401
    except Exception as e:
        return jsonify({"message": "Login failed", "error": str(e)}), 500

# ✅ Admin-Only Route: Fetch All Users
@app.route('/get-users-data', methods=['GET'])
def get_users_data():
    token = request.headers.get('Authorization')  # ✅ Get token from header

    if not token:
        return jsonify({"msg": "Missing Authorization Header"}), 401

    try:
        token = token.split(" ")[1]  # ✅ Remove "Bearer " part
        decoded_token = jwt.decode(token, 'your_secret_key', algorithms=['HS256'])
        print("Decoded Token:", decoded_token)  # Debugging

        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT id, name, email, phonenum, address FROM users")
        users = cursor.fetchall()
        cursor.close()

        return jsonify(users), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"msg": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"msg": "Invalid token"}), 401
    except Exception as e:
        print("Error fetching users:", str(e))
        return jsonify({"error": "Failed to fetch users"}), 500

# ✅ User Data Submission (Requires JWT)
@app.route('/submit-form', methods=['POST'])
@jwt_required()
def submit_form():
    data = request.get_json()
    email = get_jwt_identity()

    try:
        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO user_data (email, name, phone, address) VALUES (%s, %s, %s, %s)",
                       (email, data.get("name"), data.get("phone"), data.get("address")))
        conn.commit()
        conn.close()
        return jsonify({"message": "User data saved successfully!"}), 201
    except Exception as e:
        return jsonify({"message": "Data submission failed", "error": str(e)}), 500

# ✅ Retrieve User Data (Requires JWT)
@app.route('/get-all-users-data', methods=['GET'])
@jwt_required()
def get_all_users_data():
    current_user = get_jwt_identity()

    try:
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)

        if current_user == "admin":
            cursor.execute("SELECT * FROM user_data")
        else:
            cursor.execute("SELECT * FROM user_data WHERE email = %s", (current_user,))

        users = cursor.fetchall()
        conn.close()
        return jsonify(users), 200
    except Exception as e:
        return jsonify({"message": "Error retrieving user data", "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

