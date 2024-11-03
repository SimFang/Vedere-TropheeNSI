// services/user-service/routes/userRoutes.js
const express = require('express');
const { getPropositionById, addWorkToProposition, getLastPropositionsWithResults } = require('../controllers/propositionController');
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(), // Store files in memory
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});
const router = express.Router();

// Route for retrieving a proposition by propositionId
router.post('/getpropositionbyid', getPropositionById);

// Route for adding work to a proposition with file upload
router.post('/addworktoproposition', upload.array('images', 20), addWorkToProposition);

router.get('/getlastpropositionswithresults', getLastPropositionsWithResults);


module.exports = router; // Ensure you are exporting the router correctly