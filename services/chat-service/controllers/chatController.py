from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_admin import credentials, initialize_app, db
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize Firebase
cred = credentials.Certificate("path/to/your/firebase/credentials.json")
initialize_app(cred, {
    'databaseURL': 'https://your-database-name.firebaseio.com/'
})
db_realtime = db.reference('conversations')

@app.route('/hey', methods=['GET'])
def hello():
    return "Hello, World!"

@app.route('/api/users/conversations', methods=['POST'])
def create_conversation():
    data = request.get_json()
    p1_id = data.get("p1_id")
    p2_id = data.get("p2_id")
    
    if not p1_id or not p2_id:
        return jsonify({"error": "p1_id and p2_id are required"}), 400
    
    snapshot = db_realtime.get()
    existing_conversation_id = None
    
    for key, conversation in snapshot.items():
        if (conversation["p1_id"] == p1_id and conversation["p2_id"] == p2_id) or \
           (conversation["p1_id"] == p2_id and conversation["p2_id"] == p1_id):
            existing_conversation_id = key
            break
    
    if existing_conversation_id:
        return jsonify({"message": "Conversation already exists", "id": existing_conversation_id}), 200
    
    new_conversation_ref = db_realtime.push()
    new_conversation_ref.set({
        "p1_id": p1_id,
        "p2_id": p2_id,
        "lastmessage": "",
        "lastTimestamp": "",
        "proposition_id": "",
        "chat": [""]
    })
    
    return jsonify({"success": "Conversation added successfully", "id": new_conversation_ref.key}), 201

@app.route('/api/users/messages', methods=['POST'])
def add_message():
    data = request.get_json()
    sender = data.get("sender")
    msg_type = data.get("type")
    content = data.get("content")
    timestamp = data.get("timestamp")
    conversation_id = data.get("conversation_id")
    
    if not all([sender, msg_type, content, timestamp, conversation_id]):
        return "Bad Request: All fields are required", 400
    
    conversation_ref = db.reference(f'conversations/{conversation_id}')
    snapshot = conversation_ref.get()
    
    if not snapshot:
        return "Conversation not found", 404
    
    new_message = {
        "sender": sender,
        "type": msg_type,
        "content": content,
        "timestamp": timestamp
    }
    
    chat_ref = conversation_ref.child("chat").push(new_message)
    conversation_ref.update({"lastMessage": content, "lastTimestamp": timestamp})
    
    return "Message added to conversation", 200

if __name__ == '__main__':
    app.run(debug=True, port=int(os.environ.get("PORT", 8000)))
