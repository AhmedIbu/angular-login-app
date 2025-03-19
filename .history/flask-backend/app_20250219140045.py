from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, JWTManager



app = Flask(__name__)

@app.route('/' , methods=['GET'])
def index():
    return "Flask API is running!"

CORS(app)
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
jwt = JWTManager(app)


users = []    #to store creds
user_data = [] #to store details

@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.json
    users.append(data)  # Store user data in memory
    return jsonify({"message": "User added successfully"}), 201

# ✅ API to fetch all users
@app.route('/users', methods=['GET'])
def get_users():
    return jsonify(users)  # Return all stored users

@app.route("/register",methods=["POST"])
def register():
    data = request.get_json()
    users.append(data)
    return jsonify({'message': 'User Registered Succesfully'})

@app.route("/login",methods=["POST"])
def login():
    data = request.get_json()
    for user in users:
        if user['email'] == data['email'] and user['password'] == data['password']:
            token = create_access_token(identity=user['email'])
            return jsonify({'token':token})
    return jsonify({'message': 'Invalid Credentials'}), 401

@app.route('/submit-form', methods=['POST'])
@jwt_required()
def submit_form():
    data = request.get_json()
    user_data.append(data)
    return jsonify({"message": "User data saved Succesfully!"})

@app.route('/get-users-data',methods=['GET'])
@jwt_required()
def get_users_data():
    return jsonify(user_data)

if __name__ == '__main__':
    app.run(debug=True)
    print(app.url_map)
