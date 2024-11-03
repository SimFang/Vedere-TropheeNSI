const express = require('express');
const { getSuggestion, checkLocation, giveCoordinates } = require('../controllers/locationController');

const router = express.Router();

// Use the upload.array middleware before calling the requestPhotographer controller
router.get('/getsuggestion', getSuggestion);
router.get('/check', checkLocation);
router.post('/givecoordinates', giveCoordinates)

module.exports = router;
