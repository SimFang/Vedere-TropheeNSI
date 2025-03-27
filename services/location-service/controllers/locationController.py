from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv
import uuid
import firebase_admin
from firebase_admin import firestore
from google.cloud import storage
from helpers.getCoordinatesFromAdress import get_coordinate_from_address

# Load environment variables from a .env file
load_dotenv()

# Initialize Firestore and Storage
firebase_admin.initialize_app()
db = firestore.client()
storage_client = storage.Client()

app = Flask(__name__)

@app.route('/checkLocation', methods=['GET'])
def check_location():
    input_address = request.args.get('input')

    if not input_address:
        return jsonify({'error': 'Input is required'}), 400

    try:
        response = requests.get(
            f'https://nominatim.openstreetmap.org/search?format=json&q={input_address}&limit=1'
        )
        data = response.json()
        return jsonify({'isValid': len(data) > 0})
    except Exception as error:
        print('Error validating address:', error)
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/giveCoordinates', methods=['POST'])
def give_coordinates():
    address = request.json.get('address')

    if not address:
        return jsonify({'error': 'Address is required'}), 400

    try:
        coordinates = get_coordinate_from_address(address)
        print(coordinates)

        if not coordinates:
            return jsonify({'error': 'Coordinates not found for the given address'}), 404

        return jsonify({'coordinates': coordinates}), 200
    except Exception as error:
        print('Error fetching coordinates:', error)
        return jsonify({'error': 'An error occurred while fetching coordinates'}), 500

if __name__ == '__main__':
    app.run(debug=True)
