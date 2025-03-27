from flask import Flask, request, jsonify
import os
import firebase_admin
from firebase_admin import firestore, storage
from dotenv import load_dotenv
import uuid
import pathlib
import requests
from helpers.calculate_distance import calculate_distance
from helpers.get_coordinates_from_address import get_coordinate_from_address
from helpers.image_upload import upload_single_image

# Load environment variables from a .env file
load_dotenv()

# Initialize Firestore and Storage
firebase_admin.initialize_app()
db = firestore.client()
bucket = storage.bucket()

app = Flask(__name__)

@app.route('/getPropositionById', methods=['POST'])
async def get_proposition_by_id():
    try:
        data = request.json
        proposition_id = data.get('propositionId')

        if not proposition_id or not isinstance(proposition_id, str):
            return jsonify({'message': 'Invalid or missing propositionId'}), 400

        proposition_ref = db.collection('propositions').document(proposition_id)
        proposition_snapshot = await proposition_ref.get()

        if proposition_snapshot.exists:
            return jsonify(proposition_snapshot.to_dict()), 200
        else:
            return jsonify({'message': 'Proposition not found'}), 404

    except Exception as error:
        print("Error retrieving proposition:", error)
        return jsonify({'message': 'Could not retrieve proposition'}), 500

@app.route('/addWorkToProposition', methods=['POST'])
async def add_work_to_proposition():
    data = request.form
    proposition_id = data.get('proposition_id')
    files = request.files.getlist('files')

    if not proposition_id or not files:
        return jsonify({'message': 'Proposition ID and images are required'}), 400

    try:
        proposition_ref = db.collection('propositions').document(proposition_id)
        proposition_snapshot = await proposition_ref.get()

        if not proposition_snapshot.exists:
            return jsonify({'message': 'Proposition not found'}), 404

        image_urls = []

        for file in files:
            image_url = await upload_single_image(file)
            image_urls.append(image_url)

        await proposition_ref.update({
            'results': firestore.ArrayUnion(image_urls),
        })

        return jsonify({'message': 'Images added to proposition successfully', 'imageUrls': image_urls}), 200

    except Exception as error:
        print("Error adding images to proposition:", error)
        return jsonify({'message': str(error)}), 500

@app.route('/getLastPropositionsWithResults', methods=['GET'])
async def get_last_propositions_with_results():
    try:
        propositions_snapshot = await db.collection('propositions').where('isActive', '==', False).get()

        valid_propositions = []
        for doc in propositions_snapshot:
            proposition_data = {**doc.to_dict(), 'id': doc.id}
            if isinstance(proposition_data.get('results'), list) and len(proposition_data['results']) > 0:
                valid_propositions.append(proposition_data)

        random_propositions = []
        while len(random_propositions) < 20 and valid_propositions:
            random_index = random.randint(0, len(valid_propositions) - 1)
            random_propositions.append(valid_propositions.pop(random_index))

        return jsonify(random_propositions), 200

    except Exception as error:
        print("Error retrieving random propositions:", error)
        return jsonify({'message': 'Could not retrieve propositions'}), 500

@app.route('/togglePropositionValidation', methods=['POST'])
async def toggle_proposition_validation():
    try:
        data = request.json
        shooting_id = data.get('shooting_id')
        user_id = data.get('user_id')

        if not shooting_id or not user_id:
            return jsonify({'message': 'Invalid or missing shooting_id or user_id'}), 400

        proposition_ref = db.collection('propositions').document(shooting_id)
        proposition_snapshot = await proposition_ref.get()

        if not proposition_snapshot.exists:
            return jsonify({'message': 'Proposition not found'}), 404

        proposition_data = proposition_snapshot.to_dict()
        current_validation_status = proposition_data.get('hasValidated')

        if current_validation_status == user_id:
            return jsonify({'message': 'No changes made; already validated by the user'}), 200
        elif current_validation_status:
            await proposition_ref.update({'isActive': False})
            return jsonify({'message': 'Proposition is now inactive'}), 200
        else:
            await proposition_ref.update({'hasValidated': user_id})
            return jsonify({'message': 'Proposition has been validated by the user'}), 200

    except Exception as error:
        print("Error toggling proposition validation status:", error)
        return jsonify({'message': 'Could not toggle proposition validation status'}), 500

@app.route('/downloadPictureFromUrl', methods=['POST'])
async def download_picture_from_url():
    image_url = "ef85130a-389c-4fc4-80c5-724b056a3cff.jpg"

    if not image_url:
        return jsonify({'error': 'Image URL is required'}), 400

    try:
        file_name = pathlib.Path(image_url).name
        local_file_path = pathlib.Path(__file__).parent / file_name

        file = bucket.blob(file_name)
        file.download_to_filename(local_file_path)

        with open(local_file_path, 'rb') as f:
            response = requests.post("https://file.io", files={'file': f})

        if response.ok:
            file_url = response.json().get('link')
            local_file_path.unlink()
            return jsonify({'fileUrl': file_url}), 200
        else:
            raise Exception("File.io upload failed")

    except Exception as error:
        print("Error uploading to File.io:", error)
        return jsonify({'error': 'Failed to upload to File.io'}), 500

if __name__ == '__main__':
    app.run(debug=True)
