// services/user-service/routes/userRoutes.js
const express = require('express');
const {
    signup,
    login,
    getUserProfile,
    emailVerification,
    updateProfilePicture,
    updatePassword,
    updateEmail
} = require('../controllers/userController');
const router = express.Router();
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/signup', signup);
router.post('/login', login);
router.get('/getinfo', getUserProfile);
router.post('/emailverification', emailVerification);
router.post('/update-profile-picture', upload.single('file'), updateProfilePicture);
router.patch('/update-password', updatePassword); // Route for updating password
router.patch('/update-email', updateEmail);       // Route for updating email

module.exports = router;
