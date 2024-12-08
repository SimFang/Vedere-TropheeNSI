const { Storage } = require('@google-cloud/storage');
const admin = require('firebase-admin');
require('dotenv').config();
const { v4: uuidv4 } = require("uuid");
const {getCoordinateFromAdress} = require("../../../helpers/getCoordinatesFromAdress")

// Initialize Firestore and Storage
const db = admin.firestore();
const storage = new Storage();

exports.checkLocation = async (req,res)=> {
    const { input } = req.query;

  if (!input) {
    return res.status(400).json({ error: 'Input is required' });
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${input}&limit=1`
    );
    const data = await response.json();
    res.json({ isValid: data.length > 0 });
  } catch (error) {
    console.error('Error validating address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Assuming you are using Express.js
exports.giveCoordinates = async (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  try {
    const coordinates = await getCoordinateFromAdress(address);
    console.log(coordinates)
    
    // Check if coordinates were returned successfully
    if (!coordinates) {
      return res.status(404).json({ error: 'Coordinates not found for the given address' });
    }

    return res.status(200).json({ coordinates });
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return res.status(500).json({ error: 'An error occurred while fetching coordinates' });
  }
};