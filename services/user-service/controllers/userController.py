# controllers/user_controller.py
import os
from dotenv import load_dotenv
from firebase_admin import auth, firestore
from flask import Flask, request, jsonify
from mailjet_rest import Client
import random
from datetime import datetime
import logging
from pathlib import Path

# Load environment variables
load_dotenv()

# Initialize Flask app (assuming this is part of a larger app)
app = Flask(__name__)

# Initialize Firebase
db = firestore.client()

# Initialize Mailjet
mailjet = Client(auth=(os.getenv('MAILJET_APIKEY'), os.getenv('MAILJET_SECRETKEY')), version='v3.1')

# Assuming image_upload is a separate module
from helpers.image_upload import upload_single_image, upload_multiple_images

# Signup
@app.route('/signup', methods=['POST'])
async def signup():
    data = request.get_json()
    name, surname, email, password = data.get('name'), data.get('surname'), data.get('email'), data.get('password')
    
    try:
        user = auth.create_user(email=email, password=password)
        
        # Save user details in Firestore
        db.collection('Users').document(user.uid).set({
            'email': email,
            'name': name,
            'surname': surname,
            'profile_picture': 'https://i.sstatic.net/l60Hf.png',
            'createdAt': datetime.now(),
            'note': 5
        })
        
        logging.info("User created successfully")
        return jsonify({'message': 'User created successfully', 'userId': user.uid}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Login
@app.route('/login', methods=['POST'])
async def login():
    data = request.get_json()
    email, password = data.get('email'), data.get('password')
    
    try:
        user = auth.get_user_by_email(email)
        custom_token = auth.create_custom_token(user.uid)
        return jsonify({'token': custom_token.decode('utf-8')}), 200
    except Exception:
        return jsonify({'error': 'Invalid credentials'}), 401

# Get User Profile
@app.route('/profile', methods=['GET'])
async def get_user_profile():
    id_token = request.headers.get('Authorization', '').split('Bearer ')[-1]
    
    if not id_token:
        return jsonify('Unauthorized: No token provided'), 401
    
    try:
        decoded_token = auth.verify_id_token(id_token)
        user_id = decoded_token['uid']
        
        user_doc = db.collection('Users').document(user_id).get()
        
        if not user_doc.exists:
            return jsonify('User not found'), 404
            
        return jsonify({'userId': user_id, **user_doc.to_dict()}), 200
    except Exception as e:
        logging.error(f'Error fetching user profile: {e}')
        return jsonify('Internal Server Error'), 500

# Email Verification
@app.route('/email-verification', methods=['POST'])
async def email_verification():
    email = request.get_json().get('email')
    
    try:
        verification_code = str(random.randint(100000, 999999))
        
        # Read HTML template
        template_path = Path(__file__).parent.parent.parent / 'assets' / 'email_verification.html'
        html_content = template_path.read_text().replace('${verificationCode}', verification_code)
        
        data = {
            'Messages': [{
                'From': {'Email': 'vedere.technology@gmail.com', 'Name': 'Vedere'},
                'To': [{'Email': email}],
                'Subject': 'Complete Your Registration with Vedere',
                'TextPart': f'Your verification code is {verification_code}',
                'HTMLPart': html_content
            }]
        }
        
        result = mailjet.send.create(data=data)
        
        return jsonify({
            'message': 'Verification email sent successfully',
            'verificationCode': verification_code
        }), 200
    except Exception as e:
        logging.error(f'Error sending email: {e}')
        return jsonify({'message': 'Failed to send verification email', 'error': str(e)}), 500

# Update Profile Picture
@app.route('/update-profile-picture', methods=['POST'])
async def update_profile_picture():
    id = request.form.get('id')
    file = request.files.get('file')
    
    logging.info(f"Received request to update profile picture for ID: {id}")
    
    try:
        image_url = await upload_single_image(file)
        
        user_doc = db.collection('Users').document(id).get()
        
        if user_doc.exists:
            db.collection('Users').document(id).update({'profile_picture': image_url})
            return jsonify({'message': 'Profile picture updated successfully', 'imageUrl': image_url}), 200
        else:
            photographer_doc = db.collection('photographers').document(id).get()
            
            if photographer_doc.exists:
                user_id = photographer_doc.to_dict()['userId']
                db.collection('photographers').document(id).update({'profile_picture': image_url})
                db.collection('Users').document(user_id).update({'profile_picture': image_url})
                return jsonify({
                    'message': 'Profile picture updated successfully for the photographer',
                    'imageUrl': image_url
                }), 200
            return jsonify({'message': 'No user or photographer found with the provided ID'}), 404
    except Exception as e:
        logging.error(f"Error uploading profile picture: {e}")
        return jsonify({'message': str(e)}), 500

# Update User Name
@app.route('/update-name', methods=['POST'])
async def update_user_name():
    data = request.get_json()
    user_id, name = data.get('userId'), data.get('name')
    
    if not user_id or not name:
        return jsonify({'error': 'userId and name are required.'}), 400
        
    try:
        user_doc = db.collection('Users').document(user_id)
        if not user_doc.get().exists:
            return jsonify({'error': 'User not found.'}), 404
            
        user_doc.update({'name': name})
        return jsonify({'message': 'User name updated successfully.'}), 200
    except Exception as e:
        logging.error(f'Error updating user name: {e}')
        return jsonify({'error': 'Internal server error'}), 500

# Update User Surname
@app.route('/update-surname', methods=['POST'])
async def update_user_surname():
    data = request.get_json()
    user_id, surname = data.get('userId'), data.get('surname')
    
    if not user_id or not surname:
        return jsonify({'error': 'userId and surname are required.'}), 400
        
    try:
        user_doc = db.collection('Users').document(user_id)
        if not user_doc.get().exists:
            return jsonify({'error': 'User not found.'}), 404
            
        user_doc.update({'surname': surname})
        return jsonify({'message': 'User surname updated successfully.'}), 200
    except Exception as e:
        logging.error(f'Error updating user surname: {e}')
        return jsonify({'error': 'Internal server error'}), 500

# Update Password
@app.route('/update-password', methods=['POST'])
async def update_password():
    data = request.get_json()
    id_token, new_password = data.get('idToken'), data.get('newPassword')
    
    try:
        decoded_token = auth.verify_id_token(id_token)
        user_id = decoded_token['uid']
        
        auth.update_user(user_id, password=new_password)
        return jsonify({'message': 'Password updated successfully'}), 200
    except Exception as e:
        logging.error(f'Error updating password: {e}')
        return jsonify({'error': str(e)}), 500

# Update Email
@app.route('/update-email', methods=['POST'])
async def update_email():
    data = request.get_json()
    user_id, id_token, new_email = data.get('userId'), data.get('idToken'), data.get('newEmail')
    
    try:
        decoded_token = auth.verify_id_token(id_token)
        auth_user_id = decoded_token['uid']
        
        if user_id != auth_user_id:
            return jsonify({'error': 'User is not authorized to update this email.'}), 403
            
        auth.update_user(user_id, email=new_email)
        db.collection('Users').document(user_id).update({'email': new_email})
        return jsonify({'message': 'Email updated successfully'}), 200
    except Exception as e:
        logging.error(f'Error updating email: {e}')
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)