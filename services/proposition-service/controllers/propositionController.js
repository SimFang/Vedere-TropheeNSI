const { Storage } = require('@google-cloud/storage');
const admin = require('firebase-admin');
require('dotenv').config();
const multer = require('multer');
const { v4: uuidv4 } = require("uuid");
const {calculateDistance} = require("../../../helpers/calculateDistance")
const { getCoordinateFromAdress } = require('../../../helpers/getCoordinatesFromAdress') 
const {uploadSingleImage} = require('../../../helpers/imageUpload/imageUpload')
const path = require('path');


// Initialize Firestore and Storage
const db = admin.firestore();
const storage = new Storage();
const bucket = admin.storage().bucket()
const upload = multer({ storage: storage }); // Use memory storage for multer

// Endpoint to retrieve a proposition by propositionId
exports.getPropositionById = async (req, res) => {
    try {
        const { propositionId } = req.body; // Extracting propositionId from the request body

        // Ensure that propositionId is provided and is a string
        if (!propositionId || typeof propositionId !== 'string') {
            return res.status(400).json({ message: 'Invalid or missing propositionId' });
        }

        const propositionRef = db.collection('propositions').doc(propositionId);
        const propositionSnapshot = await propositionRef.get();

        if (propositionSnapshot.exists) {
            // Proposition found, return its data
            return res.status(200).json(propositionSnapshot.data());
        } else {
            // Proposition not found
            return res.status(404).json({ message: 'Proposition not found' });
        }
    } catch (error) {
        console.error('Error retrieving proposition:', error);
        return res.status(500).json({ message: 'Could not retrieve proposition' });
    }
};

// Add work to proposition endpoint
exports.addWorkToProposition = async (req, res) => {
    const { proposition_id } = req.body; // Get proposition ID from request body
    const files = req.files; // Get uploaded files (images)

    if (!proposition_id || !files || files.length === 0) {
        return res.status(400).json({ message: 'Proposition ID and images are required' });
    }

    try {
        // Check if the proposition exists
        const propositionSnapshot = await admin.firestore().collection('propositions').doc(proposition_id).get();

        if (!propositionSnapshot.exists) {
            return res.status(404).json({ message: 'Proposition not found' });
        }

        const imageUrls = [];

        // Upload each image and collect their URLs
        for (const file of files) {
            const imageUrl = await uploadSingleImage(file);
            imageUrls.push(imageUrl);
        }

        // Update the proposition with the image URLs in the results attribute
        await admin.firestore().collection('propositions').doc(proposition_id).update({
            results: admin.firestore.FieldValue.arrayUnion(...imageUrls),
        });

        return res.status(200).json({ message: 'Images added to proposition successfully', imageUrls });
    } catch (error) {
        console.error('Error adding images to proposition:', error);
        return res.status(500).json({ message: error.message });
    }
};

exports.getLastPropositionsWithResults = async (req, res) => {
    console.log("Fetching random propositions...");
    try {
        // Query the propositions collection where isActive is false
        const propositionsSnapshot = await db.collection('propositions')
            .where('isActive', '==', false)
            .get(); // Get all propositions with isActive = false

        // Collect the propositions data
        const validPropositions = [];
        propositionsSnapshot.forEach(doc => {
            const propositionData = { id: doc.id, ...doc.data() };

            // Check if results exist and is a non-empty array
            if (Array.isArray(propositionData.results) && propositionData.results.length > 0) {
                validPropositions.push(propositionData);
            }
        });

        // Randomly select up to 20 propositions from the valid ones
        const randomPropositions = [];
        while (randomPropositions.length < 20 && validPropositions.length > 0) {
            const randomIndex = Math.floor(Math.random() * validPropositions.length);
            randomPropositions.push(validPropositions[randomIndex]);
            // Remove the selected proposition to avoid duplicates
            validPropositions.splice(randomIndex, 1);
        }

        // Debug log to show the collected random propositions
        console.log("Collected random propositions:", randomPropositions);

        return res.status(200).json(randomPropositions);
    } catch (error) {
        console.error('Error retrieving random propositions:', error);
        return res.status(500).json({ message: 'Could not retrieve propositions' });
    }
};

// Toggle proposition validation status endpoint
exports.togglePropositionValidation = async (req, res) => {
    try {
        const { shooting_id, user_id } = req.body; // Extract shooting_id and user_id from the request body
        console.log("validating shooting")
        // Validate inputs
        if (!shooting_id || typeof shooting_id !== 'string' || !user_id || typeof user_id !== 'string') {
            return res.status(400).json({ message: 'Invalid or missing shooting_id or user_id' });
        }

        const propositionRef = db.collection('propositions').doc(shooting_id);
        const propositionSnapshot = await propositionRef.get();

        if (!propositionSnapshot.exists) {
            return res.status(404).json({ message: 'Proposition not found' });
        }

        const propositionData = propositionSnapshot.data();
        const currentValidationStatus = propositionData.hasValidated || null; // Default to null if not present

        if (currentValidationStatus === user_id) {
            // Case 3: Do nothing if hasValidated already equals user_id
            return res.status(200).json({ message: 'No changes made; already validated by the user' });
        } else if (currentValidationStatus) {
            // Case 1: hasValidated exists and is not equal to user_id
            await propositionRef.update({ isActive: false });
            return res.status(200).json({ message: 'Proposition is now inactive' });
        } else {
            // Case 2: hasValidated does not exist, set it to user_id
            await propositionRef.update({ hasValidated: user_id });
            return res.status(200).json({ message: 'Proposition has been validated by the user' });
        }
    } catch (error) {
        console.error('Error toggling proposition validation status:', error);
        return res.status(500).json({ message: 'Could not toggle proposition validation status' });
    }
};

exports.downloadPictureFromUrl = async (req, res) => {
    const imageUrl  = "ef85130a-389c-4fc4-80c5-724b056a3cff.jpg";
     // const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).send({ error: "Image URL is required" });
    }
  
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
        res.status(200).send({
          fileUrl: response.data.link,
        });
      } else {
        throw new Error("File.io upload failed");
      }
    } catch (error) {
      console.error("Error uploading to File.io:", error);
      res.status(500).send({ error: "Failed to upload to File.io" });
    }
  }