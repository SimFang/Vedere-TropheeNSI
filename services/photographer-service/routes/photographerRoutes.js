// services/photographer-service/routes/photographerRoutes.js
const express = require('express');
const multer = require('multer');
const { requestPhotographer, getPhotographerById, getNearestPhotographers, isPhotographer, loadDashboard, updateOperationLocation, updateDescription, updatePrice, updateState } = require('../controllers/photographerController');
const {test, test2} = require('../controllers/test')

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(), // Store files in memory
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

// Use the upload.single middleware before calling the requestPhotographer controller
router.post('/request', upload.array('images', 10), requestPhotographer);
router.post('/getnearest', getNearestPhotographers);
router.post('/isphotographer', isPhotographer);
router.post('/loaddashboard', loadDashboard);
router.post('/getphotographerbyid', getPhotographerById)

// Routes to modify photographer properties
router.post('/updateoperationlocation', updateOperationLocation);
router.post('/updatedescription', updateDescription);
router.post('/updateprice', updatePrice);
router.post('/updatestate', updateState);

// store images
router.post('/test',upload.single('image'),test)
router.post('/test2', upload.array('images', 10), test2); // Allow a maximum of 10 images


module.exports = router;
