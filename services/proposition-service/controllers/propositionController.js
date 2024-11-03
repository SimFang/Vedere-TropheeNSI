const { Storage } = require('@google-cloud/storage');
const admin = require('firebase-admin');
require('dotenv').config();
const multer = require('multer');
const { v4: uuidv4 } = require("uuid");
const {calculateDistance} = require("../../../helpers/calculateDistance")
const { getCoordinateFromAdress } = require('../../../helpers/getCoordinatesFromAdress') 
const {uploadSingleImage} = require('../../../helpers/imageUpload/imageUpload')


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