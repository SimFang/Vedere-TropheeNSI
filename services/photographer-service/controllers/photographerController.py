from flask import Flask, request, jsonify
import os
import firebase_admin
from firebase_admin import firestore, storage
from dotenv import load_dotenv
import uuid
from helpers.calculate_distance import calculate_distance
from helpers.get_coordinates_from_address import get_coordinate_from_address
from helpers.image_upload import upload_single_image, upload_multiple_images

# Load environment variables from a .env file
load_dotenv()

# Initialize Firestore and Storage
firebase_admin.initialize_app()
db = firestore.client()
bucket = storage.bucket()

app = Flask(__name__)

@app.route('/requestPhotographer', methods=['POST'])
async def request_photographer():
    print("New request for photographer")

    data = request.form
    files = request.files.getlist('files')

    required_fields = ['name', 'surname', 'description', 'age', 'state', 'operationLocation', 'phoneNumber', 'userId', 'isProfessional', 'price', 'profile_picture']

    for field in required_fields:
        if field not in data:
            return jsonify({'message': 'All fields are required.'}), 400

    if not files:
        return jsonify({'message': 'No files uploaded.'}), 400

    try:
        image_urls = await upload_multiple_images(files)
        work = image_urls

        new_photographer_ref = db.collection('photographers').document()
        new_photographer = {
            'name': data['name'],
            'surname': data['surname'],
            'description': data['description'],
            'age': data['age'],
            'state': data['state'],
            'work': work,
            'operationLocation': data['operationLocation'],
            'phoneNumber': data['phoneNumber'],
            'userId': data['userId'],
            'isProfessional': data['isProfessional'],
            'price': data['price'],
            'profile_picture': "https://i.sstatic.net/l60Hf.png",
            'status': 0,
            'note': 5,
        }

        await new_photographer_ref.set(new_photographer)
        return jsonify({'message': 'Photographer added successfully!', 'photographerId': new_photographer_ref.id}), 201

    except Exception as error:
        print("Error occurred while processing the request:", error)
        return jsonify({'message': 'Internal server error.'}), 500

@app.route('/getNearestPhotographers', methods=['POST'])
async def get_nearest_photographers():
    data = request.json
    user_position = data.get('userPosition')
    type_filter = data.get('type')
    expertise_filter = data.get('expertise')

    try:
        photographers_ref = db.collection('photographers')
        snapshot = await photographers_ref.get()

        photographers = [{'id': doc.id, **doc.to_dict()} for doc in snapshot]

        near_photographers = []

        for photographer in photographers:
            photographer_coordinate = await get_coordinate_from_address(photographer['operationLocation'])
            distance = await calculate_distance(user_position, photographer_coordinate)

            if distance < 100:
                near_photographers.append(photographer)

        return jsonify(near_photographers), 200

    except Exception as error:
        print("Error fetching photographers:", error)
        return jsonify({'error': 'An error occurred while fetching photographers'}), 500

@app.route('/isPhotographer', methods=['POST'])
async def is_photographer():
    data = request.json
    user_id = data.get('userId')

    if not user_id or not isinstance(user_id, str):
        return jsonify({'message': 'Invalid or missing userId'}), 400

    try:
        photographers_ref = db.collection('photographers')
        snapshot = await photographers_ref.where('userId', '==', user_id).get()

        if snapshot:
            photographer_id = snapshot[0].id
            return jsonify({'isPhotographer': photographer_id}), 200
        else:
            return jsonify({'isPhotographer': False}), 200

    except Exception as error:
        print("Error checking photographer status:", error)
        return jsonify({'message': 'Could not check photographer status'}), 500

@app.route('/getPhotographerById', methods=['POST'])
async def get_photographer_by_id():
    data = request.json
    photographer_id = data.get('photographerId')

    if not photographer_id or not isinstance(photographer_id, str):
        return jsonify({'message': 'Invalid or missing photographerId'}), 400

    try:
        photographer_ref = db.collection('photographers').document(photographer_id)
        snapshot = await photographer_ref.get()

        if snapshot.exists:
            photographer = snapshot.to_dict()
            return jsonify({'photographer': photographer}), 200
        else:
            return jsonify({'message': 'No photographer found'}), 404

    except Exception as error:
        print("Error retrieving photographer:", error)
        return jsonify({'message': 'Could not retrieve photographer data'}), 500

@app.route('/loadDashboard', methods=['POST'])
async def load_dashboard():
    data = request.json
    photographer_id = data.get('photographerId')

    if not photographer_id:
        return jsonify({'error': 'photographerId is required'}), 400

    try:
        query_snapshot = await db.collection('propositions').where('p2_id', '==', photographer_id).get()

        if not query_snapshot:
            return jsonify({'message': 'No propositions found for this photographer'}), 400

        projects = [{'id': doc.id, **doc.to_dict()} for doc in query_snapshot]

        enriched_projects = []
        for project in projects:
            user_doc = await db.collection('Users').document(project['p1_id']).get()
            if user_doc.exists:
                enriched_projects.append({**project, 'client': user_doc.to_dict()})
            else:
                enriched_projects.append(project)

        return jsonify(enriched_projects), 200

    except Exception as error:
        print("Error retrieving propositions:", error)
        return jsonify({'error': 'Something went wrong'}), 500

@app.route('/updateOperationLocation', methods=['POST'])
async def update_operation_location():
    data = request.json
    photographer_id = data.get('photographerId')
    new_value = data.get('newValue')

    try:
        photographer_ref = db.collection('photographers').document(photographer_id)
        await photographer_ref.update({'operationLocation': new_value})
        return jsonify({'message': 'Operation Location updated successfully'}), 200

    except Exception as error:
        return jsonify({'message': 'Error updating Operation Location', 'error': str(error)}), 500

@app.route('/updateState', methods=['POST'])
async def update_state():
    data = request.json
    photographer_id = data.get('photographerId')
    new_value = data.get('newValue')

    try:
        photographer_ref = db.collection('photographers').document(photographer_id)
        await photographer_ref.update({'state': new_value})
        return jsonify({'message': 'State updated successfully'}), 200

    except Exception as error:
        return jsonify({'message': 'Error updating State', 'error': str(error)}), 500

@app.route('/updateDescription', methods=['POST'])
async def update_description():
    data = request.json
    photographer_id = data.get('photographerId')
    new_value = data.get('newValue')

    try:
        photographer_ref = db.collection('photographers').document(photographer_id)
        await photographer_ref.update({'description': new_value})
        return jsonify({'message': 'Description updated successfully'}), 200

    except Exception as error:
        return jsonify({'message': 'Error updating Description', 'error': str(error)}), 500

@app.route('/updatePrice', methods=['POST'])
async def update_price():
    data = request.json
    photographer_id = data.get('photographerId')
    new_value = data.get('newValue')

    try:
        photographer_ref = db.collection('photographers').document(photographer_id)
        await photographer_ref.update({'price': new_value})
        return jsonify({'message': 'Price updated successfully'}), 200

    except Exception as error:
        return jsonify({'message': 'Error updating Price', 'error': str(error)}), 500

@app.route('/addImageToWork', methods=['POST'])
async def add_image_to_work():
    data = request.form
    photographer_id = data.get('photographerId')
    file = request.files.get('file')

    try:
        image_url = await upload_single_image(file)
        photographer_ref = db.collection('photographers').document(photographer_id)
        photographer_snapshot = await photographer_ref.get()

        if photographer_snapshot.exists:
            photographer_data = photographer_snapshot.to_dict()
            current_work = photographer_data.get('work', [])
            current_work.append(image_url)
            await photographer_ref.update({'work': current_work})
            return jsonify({'message': 'Image added to work list successfully', 'imageUrl': image_url}), 200
        else:
            return jsonify({'message': 'No photographer found with the provided ID'}), 404

    except Exception as error:
        return jsonify({'message': str(error)}), 500

@app.route('/removeImageFromWork', methods=['POST'])
async def remove_image_from_work():
    data = request.json
    photographer_id = data.get('photographerId')
    image_url = data.get('imageUrl')

    try:
        photographer_ref = db.collection('photographers').document(photographer_id)
        photographer_snapshot = await photographer_ref.get()

        if photographer_snapshot.exists:
            photographer_data = photographer_snapshot.to_dict()
            current_work = photographer_data.get('work', [])
            current_work = [image for image in current_work if image != image_url]
            await photographer_ref.update({'work': current_work})
            return jsonify({'message': 'Image removed from work list successfully'}), 200
        else:
            return jsonify({'message': 'No photographer found with the provided ID'}), 404

    except Exception as error:
        return jsonify({'message': str(error)}), 500

if __name__ == '__main__':
    app.run(debug=True)
