const { Storage } = require('@google-cloud/storage');
const admin = require('firebase-admin');
require('dotenv').config();
const multer = require('multer');
const { v4: uuidv4 } = require("uuid");
const {calculateDistance} = require("../../../helpers/calculateDistance")
const { getCoordinateFromAdress } = require('../../../helpers/getCoordinatesFromAdress') 
const { uploadSingleImage, uploadMultipleImages } = require('../../../helpers/imageUpload/imageUpload')


// Initialize Firestore and Storage
const db = admin.firestore();
const storage = new Storage();
const bucket = admin.storage().bucket()
const upload = multer({ storage: storage }); // Use memory storage for multer

// Function to handle the photographer request
exports.requestPhotographer = async (req, res) => {
    console.log("New request for photographer");

    // Destructure the required fields from req.body
    const { name, surname, description, age, state, operationLocation, phoneNumber, userId, isProfessional, price, profile_picture } = req.body;
    console.log("Destructured fields:", { name, surname, description, age, state, operationLocation, phoneNumber, userId, isProfessional, price, profile_picture });

    // Add profile picture 
    let work = []; // Array to hold image URLs
    const sentFiles = req.files; // Access uploaded files from req.files
    console.log("Received files:", sentFiles);

    // Validate input
    if (!name || !surname || !description || !age || !state || !operationLocation || !phoneNumber) {
        console.log("Validation failed: All fields are required.");
        return res.status(400).json({ message: 'All fields are required.' });
    }
    console.log("Step 1 passed: All required fields are present");

    try {
        // Check if files are present
        if (!sentFiles || sentFiles.length === 0) {
            console.log("Validation failed: No files uploaded.");
            return res.status(400).json({ message: 'No files uploaded.' });
        }
        console.log("Step 2 passed: Files are present");
        console.log("Number of files uploaded:", sentFiles.length);

        // Extract the file paths or URLs from sentFiles
        const imageUrls = await uploadMultipleImages(sentFiles); // Make sure this function handles an array of files
        work = imageUrls;
        console.log("Image URLs uploaded:", work);

        // Save photographer data to Firestore
        const newPhotographerRef = db.collection('photographers').doc(); // Create a new document with a generated ID
        const newPhotographer = {
            name,
            surname,
            description,
            age,
            state,
            work,
            operationLocation,
            phoneNumber,
            userId,
            isProfessional,
            price,
            profile_picture : "https://i.sstatic.net/l60Hf.png",
            status: 0, // Default status
            note : 5,
        };
        console.log("New photographer data:", newPhotographer);

        await newPhotographerRef.set(newPhotographer);
        console.log("Photographer added to Firestore with ID:", newPhotographerRef.id);
        res.status(201).json({ message: 'Photographer added successfully!', photographerId: newPhotographerRef.id });
    } catch (error) {
        console.error("Error occurred while processing the request:", error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

// Endpoint to get nearest photographers
exports.getNearestPhotographers = async (req, res) => {
    const { userPosition, type, expertise } = req.body;

    if (!type || !expertise) {
        console.log("treating without filters")
    }
    try {
        // gets all the photographers
        const photographersRef = db.collection('photographers');
        const snapshot = await photographersRef.get();

        const photographers = [];
        snapshot.forEach(doc => {
        const data = doc.data();
        photographers.push({
            id: doc.id,
            ...data
        });
        });
        
        // Get all the photographers' coordinates and calculate distances concurrently
        let nearPhotographers = [];

        // Create an array of promises for fetching coordinates and calculating distances
        const photographerPromises = photographers.map(async (photographer) => {
            const photographerCoordinate = await getCoordinateFromAdress(photographer.operationLocation);
            const distance = await calculateDistance(userPosition, photographerCoordinate);
            
            // Check if the photographer is within the desired distance
            if (distance < 100) {
                return photographer; // Return the photographer if they are near
            } else {
                return null; // Return null if they are too far
            }
        });

        // Wait for all promises to resolve
        const results = await Promise.all(photographerPromises);

        // Filter out null values (i.e., photographers that are too far)
        nearPhotographers = results.filter((photographer) => photographer !== null);

        console.log(nearPhotographers);
        
        res.status(200).json(nearPhotographers);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching photographers' });
    }
}

exports.isPhotographer = async (req, res) => {
    try {
        const { userId } = req.body; // Extracting userId from the request body

        // Ensure that userId is provided and is a string
        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ message: 'Invalid or missing userId' });
        }

        const photographersRef = db.collection('photographers');
        const snapshot = await photographersRef.where('userId', '==', userId).get();

        if (!snapshot.empty) {
            // User exists as a photographer, return the photographerId
            const photographer = snapshot.docs[0].data();
            const photographerId = snapshot.docs[0].id; // Assuming the document ID is the photographerId
            return res.status(200).json({ isPhotographer : photographerId });
        } else {
            // User does not exist as a photographer
            return res.status(200).json({ isPhotographer: false });
        }
    } catch (error) {
        console.error('Error checking photographer status:', error);
        return res.status(500).json({ message: 'Could not check photographer status' });
    }
};

exports.getPhotographerById = async (req, res) => {
    try {
        const { photographerId } = req.body; // Extracting photographerId from the request body

        if (!photographerId || typeof photographerId !== 'string') {
            console.log("Invalid or missing photographerId");
            return res.status(400).json({ message: 'Invalid or missing photographerId' });
        }

        const photographersRef = db.collection('photographers');
        const snapshot = await photographersRef.doc(photographerId).get(); // Use .doc() to directly access the document by ID

        if (snapshot.exists) {
            const photographer = snapshot.data();
            return res.status(200).json({ photographer });
        } else {
            console.log(`No photographer found for ID: ${photographerId}`);
            return res.status(404).json({ message: 'No photographer found' });
        }
    } catch (error) {
        console.error('Error retrieving photographer:', error);
        return res.status(500).json({ message: 'Could not retrieve photographer data' });
    }
};

exports.loadDashboard = async (req, res) => {
    try {
      const { photographerId } = req.body; // Get photographerId from request body
  
      if (!photographerId) {
        return res.status(400).json({ error: "photographerId is required" });
      }
  
      // Query the Firestore 'propositions' collection where p2_id matches photographerId
      const querySnapshot = await db
        .collection('propositions')
        .where('p2_id', '==', photographerId)
        .get();
  
      if (querySnapshot.empty) {
        console.log("not found")

        return res.status(400).json({ message: "No propositions found for this photographer" });
      }
  
      // Prepare the results
      const propositions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      return res.status(200).json(propositions); // Return the list of propositions
    } catch (error) {
      console.error("Error retrieving propositions: ", error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  };

  exports.updateOperationLocation = async (req, res) => {
    const { photographerId, newValue } = req.body;
  
    try {
      const photographerRef = db.collection('photographers').doc(photographerId);
      await photographerRef.update({
        operationLocation: newValue
      });
  
      res.status(200).send({ message: 'Operation Location updated successfully' });
    } catch (error) {
      res.status(500).send({ message: 'Error updating Operation Location', error: error.message });
    }
  };
  
  exports.updateState = async (req, res) => {
    console.log("received")
    const { photographerId, newValue } = req.body;
    console.log(newValue)
    try {
      const photographerRef = db.collection('photographers').doc(photographerId);
      await photographerRef.update({
        state: newValue
      });
  
      res.status(200).send({ message: 'State updated successfully' });
    } catch (error) {
        console.log("no photographer found")
      res.status(500).send({ message: 'Error updating State', error: error.message });
    }
  };
  exports.updateDescription = async (req, res) => {
    const { photographerId, newValue } = req.body;
  
    try {
      const photographerRef = db.collection('photographers').doc(photographerId);
      await photographerRef.update({
        description: newValue
      });
  
      res.status(200).send({ message: 'Description updated successfully' });
    } catch (error) {
      res.status(500).send({ message: 'Error updating Description', error: error.message });
    }
  };
  exports.updatePrice = async (req, res) => {
    const { photographerId, newValue } = req.body;
  
    try {
      const photographerRef = db.collection('photographers').doc(photographerId);
      await photographerRef.update({
        price: newValue
      });
  
      res.status(200).send({ message: 'Price updated successfully' });
    } catch (error) {
      res.status(500).send({ message: 'Error updating Price', error: error.message });
    }
  };
  