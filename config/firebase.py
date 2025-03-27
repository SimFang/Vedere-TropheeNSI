# config/firebase.py
import firebase_admin
from firebase_admin import credentials, firestore, auth, storage, db
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Flag to check if Firebase has been initialized
_is_initialized = False

def initialize_firebase():
    """Initialize Firebase app if not already initialized"""
    global _is_initialized
    
    if not _is_initialized:
        # Load service account from JSON file
        service_account_path = os.path.join(
            os.path.dirname(__file__), 
            '../utils/service-account-file.json'
        )
        
        # Initialize Firebase with credentials and configuration
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred, {
            'databaseURL': os.getenv('FIREBASE_DATABASE_URL'),
            'storageBucket': os.getenv('FIREBASE_STORAGE_BUCKET_URL'),
            'databaseURL': os.getenv('FIREASE_REALTIMEDATABASE_URL')  # Note: corrected typo from FIREASE to FIREBASE
        })
        
        _is_initialized = True

# Call the initialization function
initialize_firebase()

# Initialize and export Firebase services
db_firestore = firestore.client()  # Firestore database
auth_client = auth.Client()        # Firebase authentication
db_realtime = db                 # Realtime Database instance (direct reference)
storage_bucket = storage.bucket()  # Storage bucket

# Export as a dictionary (similar to module.exports)
firebase_services = {
    'db': db_firestore,
    'auth': auth_client,
    'dbRealtime': db_realtime,
    'bucket': storage_bucket
}

if __name__ == "__main__":
    # Test the initialization
    print("Firebase initialized:", _is_initialized)
    print("Firestore:", db_firestore)
    print("Auth:", auth_client)
    print("Realtime DB:", db_realtime)
    print("Storage Bucket:", storage_bucket.name)