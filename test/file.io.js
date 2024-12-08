const { Storage } = require('@google-cloud/storage');
const admin = require('firebase-admin');
require('dotenv').config();
const multer = require('multer');



// Initialize Firestore and Storage
const db = admin.firestore();
const storage = new Storage();
const bucket = admin.storage().bucket()
const upload = multer({ storage: storage }); // Use memory storage for multer

const givenUrl = 'https://firebasestorage.googleapis.com/v0/b/vedere-618d1.appspot.com/o/vedere%2F12e48afd-542c-44e2-b951-00816f2644bb.jpg?alt=media&token=95d9d007-4f0d-42df-b63a-ac2b3d3df204'

const downloadPictureFromUrl = async (imageUrl) => {
  
  
    try {
      // Extract the file name and create a local path
      const fileName = path.basename(imageUrl);
      const localFilePath = path.join(__dirname, fileName);
  
      // Download the file from Firebase Storage
      const file = bucket.file(fileName);
      await file.download({ destination: localFilePath });
  
      // Upload the file to File.io
      const formData = new FormData();
      formData.append("file", fs.createReadStream(localFilePath));
  
      const response = await axios.post("https://file.io", formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });
  
      // Clean up the local file after uploading
      fs.unlinkSync(localFilePath);
  
      // Return the File.io URL
      if (response.data.success) {
        console.log(response.data.link)
      } else {
        throw new Error("File.io upload failed");
      }
    } catch (error) {
      console.error("Error uploading to File.io:", error);
    }
  }

  downloadPictureFromUrl(givenUrl)