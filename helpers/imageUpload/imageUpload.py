# helpers/image_upload.py
import uuid
from firebase_admin import firestore, storage
from google.cloud.storage import Blob
import logging

# Assuming these are initialized in your config file
db = firestore.client()
bucket = storage.bucket()

async def upload_single_image(file):
    """
    Upload a single image to Firebase Storage and store its URL in Firestore
    Args:
        file: File object from Flask request.files
    Returns:
        str: Public URL of the uploaded image
    """
    logging.info("Uploading single image...")

    if not file:
        raise ValueError('No file uploaded')

    # Generate a unique file name
    filename = f"vedere/{uuid.uuid4()}.jpg"
    logging.info(f"Generated filename: {filename}")

    # Check if the bucket is initialized correctly
    if not bucket:
        raise ValueError('Firebase Storage bucket is not initialized.')

    # Upload image to Firebase Storage
    blob = bucket.blob(filename)
    blob.content_type = file.mimetype

    try:
        # Upload the file content
        blob.upload_from_file(file.stream)
        logging.info("Upload finished successfully.")

        # Generate Firebase Storage URL
        file_path_encoded = filename  # No need to encode in Python client
        firebase_storage_url = f"https://firebasestorage.googleapis.com/v0/b/{bucket.name}/o/{file_path_encoded}?alt=media"
        logging.info(f"Firebase Storage URL generated: {firebase_storage_url}")

        # Store image URL in Firestore
        await db.collection('images').add({
            'imageUrl': firebase_storage_url,
            'createdAt': firestore.SERVER_TIMESTAMP
        })
        logging.info("Image URL stored in Firestore.")

        return firebase_storage_url

    except Exception as e:
        logging.error(f"Error during upload: {str(e)}")
        raise Exception(f"Something went wrong: {str(e)}")

async def upload_multiple_images(files):
    """
    Upload multiple images to Firebase Storage and return their URLs
    Args:
        files: List of file objects from Flask request.files
    Returns:
        list: List of public URLs of uploaded images
    """
    logging.info("Uploading multiple images...")

    if not files or len(files) == 0:
        raise ValueError('No files uploaded')

    image_urls = []
    for file in files:
        public_url = await upload_single_image(file)
        image_urls.append(public_url)

    return image_urls

# Example usage (for testing purposes)
if __name__ == "__main__":
    import asyncio
    
    # This is just for testing; in practice, files would come from a request
    async def test():
        # Simulated file object would need to be replaced with actual file handling
        # This is just to show the structure
        class MockFile:
            def __init__(self):
                self.mimetype = 'image/jpeg'
                self.stream = open('test.jpg', 'rb')  # Assume a test image exists
                
        try:
            result = await upload_single_image(MockFile())
            print(f"Uploaded image URL: {result}")
        except Exception as e:
            print(f"Error: {e}")
            
    asyncio.run(test())