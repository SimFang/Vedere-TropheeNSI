const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');
const { db, bucket } = require('../../../config/firebase'); // Import Firestore and Storage bucket from firebase.js
const { uploadMultipleImages, uploadSingleImage } = require('../../../helpers/imageUpload/imageUpload');

// Endpoint to upload a single image
exports.test = async (req, res) => {
    console.log("Received a request to upload an image.");

    try {
        const file = req.file; // Get the uploaded file from the request
        console.log("File received:", file); // Log the file object

        if (!file) {
            console.log("No file uploaded.");
            return res.status(400).send({ message: 'No file uploaded' });
        }

        // Call the uploadSingleImage function to handle the upload
        const publicUrl = await uploadSingleImage(file);

        // Store image URL in Firestore
        await db.collection('images').add({
            imageUrl: publicUrl,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log("Image URL stored in Firestore.");
        res.status(200).send({ message: 'File uploaded successfully', imageUrl: publicUrl });
    } catch (error) {
        console.log("An error occurred in the try-catch block:", error.message); // Log error messages
        res.status(500).send({ message: 'Error uploading image', error: error.message });
    }
};

// Endpoint to upload multiple images
exports.test2 = async (req, res) => {
    console.log("Received a request to upload multiple images.");

    try {
        const files = req.files; // Get the uploaded files from the request
        console.log("Files received:", files); // Log the array of file objects

        if (!files || files.length === 0) {
            console.log("No files uploaded.");
            return res.status(400).send({ message: 'No files uploaded' });
        }

        // Call the uploadMultipleImages function to handle the uploads
        const imageUrls = await uploadMultipleImages(files);

        // Store each image URL in Firestore
        for (const imageUrl of imageUrls) {
            await db.collection('images').add({
                imageUrl,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            console.log("Image URL stored in Firestore:", imageUrl);
        }

        res.status(200).send({ message: 'Files uploaded successfully', imageUrls });
    } catch (error) {
        console.log("An error occurred in the try-catch block:", error.message); // Log error messages
        res.status(500).send({ message: 'Error uploading images', error: error.message });
    }
};
