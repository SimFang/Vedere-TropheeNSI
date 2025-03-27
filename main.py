from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
import firebase_admin
from firebase_admin import credentials, db

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize Firebase Admin SDK
cred = credentials.Certificate("path/to/your/firebase/credentials.json")  # Replace with your credentials path
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://your-database.firebaseio.com'  # Replace with your database URL
})

# Simple endpoint
@app.route('/hey', methods=['GET'])
def hello():
    return "Hello, World!"

# Import and register blueprints (similar to routes in Express.js)
from services.user_service.routes.user_routes import user_routes
from services.photographer_service.routes.photographer_routes import photographer_routes
from services.location_service.routes.location_routes import location_routes
from services.chat_service.routes.chat_routes import chat_routes
from services.proposition_service.routes.proposition_routes import proposition_routes
from services.payment_service.routes.payment_routes import payment_routes

app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(photographer_routes, url_prefix='/api/photographers')
app.register_blueprint(location_routes, url_prefix='/api/location')
app.register_blueprint(chat_routes, url_prefix='/api/chat')
app.register_blueprint(proposition_routes, url_prefix='/api/propositions')
app.register_blueprint(payment_routes, url_prefix='/api/payment')

# Error handling middleware
@app.errorhandler(Exception)
def handle_error(e):
    return jsonify({'error': str(e)}), 500

# Set up WebSocket server
socketio = SocketIO(app, cors_allowed_origins="*")

db_realtime = db.reference('conversations')  # Replace with your data path

def firebase_listener(event):
    socketio.emit('data_changed', {'message': 'Data has changed'})

db_realtime.listen(firebase_listener)

@socketio.on('connect')
def handle_connect():
    print("New client connected")

@socketio.on('disconnect')
def handle_disconnect():
    print("Client disconnected")

# Run the server
if __name__ == '__main__':
    socketio.run(app, port=8000, debug=True)
