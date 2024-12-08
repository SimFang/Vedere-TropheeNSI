// services/user-service/controllers/userController.js
require('dotenv').config(); // Load environment variables
const admin = require('firebase-admin');
const { auth, db } = require('../../../config/firebase');
const Mailjet = require('node-mailjet');
const path = require('path'); // For file path resolution
const fs = require('fs'); // To read the HTML file


const { uploadSingleImage, uploadMultipleImages } = require('../../../helpers/imageUpload/imageUpload')


const mailjet = Mailjet.apiConnect(
    process.env.MAILJET_APIKEY,
    process.env.MAILJET_SECRETKEY,
);


// services/user-service/controllers/userController.js
exports.signup = async (req, res) => {
    const { name, surname, email, password } = req.body; // Update to include name and surname

    try {
        const userRecord = await auth.createUser({
            email,
            password
        });

        // Save user details in Firestore, including name and surname
        await db.collection('Users').doc(userRecord.uid).set({
            email,
            name, // Save name
            surname, // Save surname
            profile_picture : "https://i.sstatic.net/l60Hf.png",
            createdAt: new Date(),
            note : 5,
        });
        console.log("user created succesfully")

        res.status(201).json({ message: 'User created successfully', userId: userRecord.uid });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Login User
exports.login = async (req, res) => {
    console.log("login the user")
    const { email, password } = req.body;

    try {
        const userRecord = await auth.getUserByEmail(email);
        
        // Verify password using Firebase
        // Note: You may want to use Firebase's Authentication REST API for client-side login
        const customToken = await auth.createCustomToken(userRecord.uid);
        res.status(200).json({ token: customToken });
    } catch (error) {
        res.status(401).json({ error: 'Invalid credentials' });
    }
};



exports.getUserProfile = async (req, res) => {
    // Step 1: Get the ID token from the request header
    const idToken = req.headers.authorization?.split('Bearer ')[1];
  
    if (!idToken) {
      return res.status(401).send('Unauthorized: No token provided');
    }
  
    try {
      // Step 2: Verify the ID token
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const userId = decodedToken.uid;
  
      // Step 3: Retrieve user information from Firestore
      const userDoc = await admin.firestore().collection('Users').doc(userId).get();
  
      if (!userDoc.exists) {
        return res.status(404).send('User not found');
      }
  
      // Send userId and user information as the response
      return res.status(200).json({
        userId: userId,
        ...userDoc.data(),
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return res.status(500).send('Internal Server Error');
    }
  };
  

// Function to send verification email
exports.emailVerification = async (req, res) => {
    const { email } = req.body; // Get email from request body

    try {
        // Generate a random verification code (e.g., 6-digit code)
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Read the HTML template from the file system
        const htmlTemplatePath = path.join(__dirname, '../../..', 'assets', 'emailVerification.html');
        let htmlContent = fs.readFileSync(htmlTemplatePath, 'utf-8'); // Read file content as string

        // Replace the placeholder in the HTML template with the actual verification code
        htmlContent = htmlContent.replace('${verificationCode}', verificationCode);

        // Email content
        const request = mailjet
            .post('send', { version: 'v3.1' })
            .request({
                Messages: [
                    {
                        From: {
                            Email: 'vedere.technology@gmail.com', // Your sender email
                            Name: 'Vedere', // Your sender name
                        },
                        To: [
                            {
                                Email: email, // Receiver's email
                            },
                        ],
                        Subject: 'Complete Your Registration with Vedere',
                        TextPart: `Your verification code is ${verificationCode}`,
                        HTMLPart: htmlContent, // Use the dynamic HTML content
                    },
                ],
            });

        // Send email
        await request;

        // Respond with success
        res.status(200).json({
            message: 'Verification email sent successfully',
            verificationCode, // Include the code if you need it for debugging or verification
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            message: 'Failed to send verification email',
            error: error.message,
        });
    }
};

exports.updateProfilePicture = async (req, res) => {
    const { id } = req.body; // Get user ID from request body
    const file = req.file; // Assuming you're using a middleware like multer to handle file uploads

    console.log("Received request to update profile picture for ID:", id);
    console.log("Received file:", file);

    try {
        // Upload image and get public URL
        const imageUrl = await uploadSingleImage(file);
        console.log("Image uploaded successfully. Public URL:", imageUrl);

        // Check if the user exists in the 'Users' collection
        const userSnapshot = await db.collection('Users').doc(id).get();
        console.log("User snapshot exists:", userSnapshot.exists);

        if (userSnapshot.exists) {
            // User found, update profile_picture attribute
            await db.collection('Users').doc(id).update({
                profile_picture: imageUrl,
            });
            console.log("Updated profile picture for user ID:", id);
            return res.status(200).json({ message: 'Profile picture updated successfully', imageUrl });
        } else {
            // User not found, check 'photographers' collection by ID
            const photographerDoc = await db.collection('photographers').doc(id).get();
            console.log("Photographer document exists:", photographerDoc.exists);
            console.log(photographerDoc.data())
            
            if (photographerDoc.exists) {

                const userId = photographerDoc.data().userId;
                console.log("Found photographer. Associated user ID:", userId);
                await db.collection('photographers').doc(id).update({
                    profile_picture: imageUrl,
                })
                // Update the profile picture for the user linked to this photographer
                await db.collection('Users').doc(userId).update({
                    profile_picture: imageUrl,
                });
                console.log("Updated profile picture for photographer user ID:", userId);

                return res.status(200).json({ message: 'Profile picture updated successfully for the photographer', imageUrl });
            } else {
                console.log("No user or photographer found with the provided ID:", id);
                return res.status(404).json({ message: 'No user or photographer found with the provided ID' });
            }
        }
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        return res.status(500).json({ message: error.message });
    }
}

// In userController.js

// Function to update the user's name
exports.updateUserName = async (req, res) => {
    const { userId, name } = req.body;

    if (!userId || !name) {
        return res.status(400).json({ error: 'userId and name are required.' });
    }

    try {
        const userDoc = db.collection('Users').doc(userId);
        const userSnapshot = await userDoc.get();

        if (!userSnapshot.exists) {
            return res.status(404).json({ error: 'User not found.' });
        }

        await userDoc.update({ name });
        res.status(200).json({ message: 'User name updated successfully.' });
    } catch (error) {
        console.error('Error updating user name:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to update the user's surname
exports.updateUserSurname = async (req, res) => {
    const { userId, surname } = req.body;

    if (!userId || !surname) {
        return res.status(400).json({ error: 'userId and surname are required.' });
    }

    try {
        const userDoc = db.collection('Users').doc(userId);
        const userSnapshot = await userDoc.get();

        if (!userSnapshot.exists) {
            return res.status(404).json({ error: 'User not found.' });
        }

        await userDoc.update({ surname });
        res.status(200).json({ message: 'User surname updated successfully.' });
    } catch (error) {
        console.error('Error updating user surname:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// services/user-service/controllers/userController.js
exports.updatePassword = async (req, res) => {
    const { idToken, newPassword } = req.body;

    try {
        // Verify the ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const userId = decodedToken.uid;

        // Update the password
        await admin.auth().updateUser(userId, { password: newPassword });

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ error: error.message });
    }
};

exports.updateEmail = async (req, res) => {
    const { userId, idToken, newEmail } = req.body;

    try {
        // Verify the ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const authUserId = decodedToken.uid;

        // Check if the userId from the request matches the authenticated user
        if (userId !== authUserId) {
            return res.status(403).json({ error: 'User is not authorized to update this email.' });
        }

        // Update the email in Firebase Authentication
        await admin.auth().updateUser(userId, { email: newEmail });

        // Update the email in the 'Users' collection
        await db.collection('Users').doc(userId).update({ email: newEmail });

        return res.status(200).json({ message: 'Email updated successfully' });
    } catch (error) {
        console.error('Error updating email:', error);
        return res.status(500).json({ error: error.message });
    }
};
