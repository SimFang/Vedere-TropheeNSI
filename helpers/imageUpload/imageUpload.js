const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');
const { db, bucket } = require('../../config/firebase'); // Import Firestore and Storage bucket from firebase.js

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();  // Store files in memory for easy access
const upload = multer({ storage });

// Function to upload a single image and return its URL
// async function uploadSingleImage(file) {
//     console.log("Uploading single image...");

//     if (!file) {
//         throw new Error('No file uploaded');
//     }

//     // Generate a unique file name
//     const filename = `vedere/${uuidv4()}.jpg`;
//     console.log("Generated filename:", filename);

//     // Check if the bucket is initialized correctly
//     if (!bucket) {
//         throw new Error('Firebase Storage bucket is not initialized.');
//     }

//     // Upload image to Firebase Storage
//     const fileUpload = bucket.file(filename);
//     const blobStream = fileUpload.createWriteStream({
//         metadata: {
//             contentType: file.mimetype,
//         },
//     });

//     return new Promise((resolve, reject) => {
//         blobStream.on('error', (error) => {
//             console.error("Error during upload:", error);
//             reject(new Error('Something went wrong: ' + error.message));
//         });

//         blobStream.on('finish', async () => {
//             console.log("Upload finished successfully.");

//             // Get the public URL of the uploaded image
//             const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
//             console.log("Public URL generated:", publicUrl);

//             // Store image URL in Firestore
//             await db.collection('images').add({
//                 imageUrl: publicUrl,
//                 createdAt: admin.firestore.FieldValue.serverTimestamp(),
//             });

//             console.log("Image URL stored in Firestore.");
//             resolve(publicUrl);
//         });

//         blobStream.end(file.buffer); // Finalize the upload
//     });
// }

async function uploadSingleImage(file) {
    console.log("Uploading single image...");

    if (!file) {
        throw new Error('No file uploaded');
    }

    // Generate a unique file name
    const filename = `vedere/${uuidv4()}.jpg`;
    console.log("Generated filename:", filename);

    // Check if the bucket is initialized correctly
    if (!bucket) {
        throw new Error('Firebase Storage bucket is not initialized.');
    }

    // Upload image to Firebase Storage
    const fileUpload = bucket.file(filename);
    const blobStream = fileUpload.createWriteStream({
        metadata: {
            contentType: file.mimetype,
        },
    });

    return new Promise((resolve, reject) => {
        blobStream.on('error', (error) => {
            console.error("Error during upload:", error);
            reject(new Error('Something went wrong: ' + error.message));
        });

        blobStream.on('finish', async () => {
            console.log("Upload finished successfully.");

            // Firebase Storage specific URL with alt=media parameter
            const filePathEncoded = encodeURIComponent(filename);
            const firebaseStorageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${filePathEncoded}?alt=media`;
            console.log("Firebase Storage URL generated:", firebaseStorageUrl);

            // Store image URL in Firestore
            await db.collection('images').add({
                imageUrl: firebaseStorageUrl,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            console.log("Image URL stored in Firestore.");
            resolve(firebaseStorageUrl);
        });

        blobStream.end(file.buffer); // Finalize the upload
    });
}

// Function to upload multiple images and return their URLs
async function uploadMultipleImages(files) {
    console.log("Uploading multiple images...");

    if (!files || files.length === 0) {
        throw new Error('No files uploaded');
    }

    const imageUrls = [];
    for (const file of files) {
        const publicUrl = await uploadSingleImage(file);
        imageUrls.push(publicUrl); // Add the public URL to the array
    }

    return imageUrls;
}


// Export the upload functions for use in routes
module.exports = {
    uploadSingleImage,
    uploadMultipleImages,
};
