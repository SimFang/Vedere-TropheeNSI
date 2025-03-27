from flask import request, jsonify

def create_conversation():
    data = request.get_json()
    # Process the data to create a conversation
    response = {"message": "Conversation created successfully"}
    return jsonify(response), 201

def get_user_interaction():
    data = request.get_json()
    # Process the data to get user interaction
    response = {"message": "User interaction retrieved successfully"}
    return jsonify(response), 200

def add_message_to_conversation():
    data = request.get_json()
    # Process the data to add a message to the conversation
    response = {"message": "Message added to conversation successfully"}
    return jsonify(response), 201

def add_proposition_to_conversation():
    data = request.get_json()
    # Process the data to add a proposition to the conversation
    response = {"message": "Proposition added to conversation successfully"}
    return jsonify(response), 201

def create_new_proposition():
    data = request.get_json()
    # Process the data to create a new proposition
    response = {"message": "New proposition created successfully"}
    return jsonify(response), 201

def update_proposition_status_in_chat():
    data = request.get_json()
    # Process the data to update the proposition status in the chat
    response = {"message": "Proposition status updated successfully"}
    return jsonify(response), 200
